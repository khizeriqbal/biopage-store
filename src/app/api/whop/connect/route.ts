import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const clientId = process.env.WHOP_CLIENT_ID;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/whop/connect/callback`;

        if (!clientId) {
            return NextResponse.json({ error: "Whop OAuth not configured globally" }, { status: 500 });
        }

        // Whop OAuth requires PKCE parameters (code_challenge & state)
        // Usually, you should store code_verifier in user session or DB, but here we just pass a simple one for demo.
        const codeVerifier = crypto.randomBytes(32).toString('hex');
        const codeChallenge = crypto
            .createHash('sha256')
            .update(codeVerifier)
            .digest('base64url');

        const state = Buffer.from(JSON.stringify({ userId, codeVerifier })).toString('base64');

        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: 'openid email profile company', // Standard scopes for fetching user company
            state: state,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256'
        });

        return NextResponse.redirect(`https://whop.com/oauth?${params.toString()}`);
    } catch (err: any) {
        console.error("Whop Connect Error:", err);
        return NextResponse.json({ error: err.message || "Failed to start Whop Connect" }, { status: 500 });
    }
}
