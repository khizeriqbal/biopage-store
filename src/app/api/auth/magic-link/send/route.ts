import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { resend } from "@/lib/email";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            );
        }

        // Generate magic link token
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Find or create user
        let user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            // Create new user with magic link
            user = await prisma.user.create({
                data: {
                    email: email.toLowerCase(),
                    username: email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "") + Math.random().toString(36).slice(-4),
                    magicLinkToken: token,
                    magicLinkExpires: expires,
                    onboardingDone: false,
                    plan: "FREE"
                }
            });
        } else {
            // Update existing user with new magic link
            user = await prisma.user.update({
                where: { email: email.toLowerCase() },
                data: {
                    magicLinkToken: token,
                    magicLinkExpires: expires
                }
            });
        }

        // Send email with magic link
        const magicLink = `${process.env.NEXTAUTH_URL}/auth/magic-link/verify?token=${token}`;

        await resend.emails.send({
            from: process.env.EMAIL_FROM || "noreply@biopage.store",
            to: email,
            subject: "Your Magic Link Login - bio page.store",
            html: `
                <h2>Sign In to bio page.store</h2>
                <p>Click the link below to sign in (valid for 24 hours):</p>
                <p>
                    <a href="${magicLink}" style="background: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Sign In with Magic Link
                    </a>
                </p>
                <p>Or copy this link: <code>${magicLink}</code></p>
                <p>If you didn't request this, you can safely ignore this email.</p>
            `
        });

        return NextResponse.json({
            success: true,
            message: "Magic link sent to your email"
        });
    } catch (error: any) {
        console.error("Magic link send error:", error);
        return NextResponse.json(
            { error: "Failed to send magic link" },
            { status: 500 }
        );
    }
}
