import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const providers = [];

// Only add Google if credentials are actually configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const Google = require("next-auth/providers/google").default;
    providers.push(
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile(profile: any) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    username: profile.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "") + Math.random().toString(36).slice(-4),
                    onboardingDone: false,
                    plan: "FREE",
                };
            },
        })
    );
}

providers.push(
    Credentials({
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            try {
                const parsed = z.object({
                    email: z.string().email(),
                    password: z.string().min(6),
                }).safeParse(credentials);

                if (!parsed.success) return null;

                const user = await prisma.user.findUnique({
                    where: { email: parsed.data.email },
                });

                if (!user || !user.password) return null;

                const valid = await bcrypt.compare(parsed.data.password, user.password);
                if (!valid) return null;

                return user;
            } catch (err) {
                console.error("Credentials authorize error:", err);
                return null;
            }
        },
    })
);

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async jwt({ token, user, trigger }) {
            // On initial sign in, populate token from the user object
            if (user) {
                token.id = user.id;
                token.username = (user as any).username;
                token.plan = (user as any).plan;
                token.onboardingDone = (user as any).onboardingDone;
            }
            // On session update trigger or if onboardingDone is still false, re-fetch from DB
            if (trigger === "update" || (token.id && !token.onboardingDone)) {
                try {
                    const freshUser = await prisma.user.findUnique({
                        where: { id: token.id as string },
                        select: { username: true, plan: true, onboardingDone: true },
                    });
                    if (freshUser) {
                        token.username = freshUser.username;
                        token.plan = freshUser.plan;
                        token.onboardingDone = freshUser.onboardingDone;
                    }
                } catch {
                    // DB unavailable, keep existing token data
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                (session.user as any).username = token.username;
                (session.user as any).plan = token.plan;
                (session.user as any).onboardingDone = token.onboardingDone;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            if (url.startsWith(baseUrl)) return url;
            return `${baseUrl}/dashboard`;
        },
    },
    providers,
});
