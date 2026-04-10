import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code || !state) {
            return NextResponse.json({ error: "Missing OAuth parameters" }, { status: 400 });
        }

        // Decode state
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString('ascii'));
        const { userId, codeVerifier } = stateData;

        // Exchange code for token
        const tokenRes = await fetch("https://api.whop.com/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: process.env.WHOP_CLIENT_ID,
                client_secret: process.env.WHOP_CLIENT_SECRET,
                grant_type: "authorization_code",
                code,
                redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/whop/connect/callback`,
                code_verifier: codeVerifier
            })
        });

        const tokenData = await tokenRes.json();

        if (tokenData.error) {
            console.error("Token error:", tokenData);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?whop_error=true`);
        }

        const accessToken = tokenData.access_token;
        const refreshToken = tokenData.refresh_token;

        // Use the access token to get the user's company information
        const meRes = await fetch("https://api.whop.com/v2/me", {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }
        });
        const meData = await meRes.json();

        // Whop might nest company details or user details. Assuming `meData.companies[0].id` or `meData.company_id`
        // We will just store the first company ID or the user ID if Whop operates on user level
        const companyId = meData.companies?.[0]?.id || meData.id;

        await prisma.user.update({
            where: { id: userId },
            data: {
                whopAccessToken: accessToken,
                whopRefreshToken: refreshToken,
                whopCompanyId: companyId,
            }
        });

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?whop_connected=true`);
    } catch (err: any) {
        console.error("Whop OAuth Callback Error:", err);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?whop_error=callback_failed`);
    }
}
