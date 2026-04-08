import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { username, bio, name, offerings } = await req.json();

        if (!username || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const normalizedUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');

        // Check final username availability (exclude current user)
        const existing = await prisma.user.findFirst({
            where: { username: normalizedUsername, NOT: { id: userId } }
        });

        if (existing) {
            return NextResponse.json({ error: "Username already taken" }, { status: 400 });
        }

        // Update User — use onboardingDone (Boolean) not onboardingStatus
        await prisma.user.update({
            where: { id: userId },
            data: {
                username: normalizedUsername,
                name,
                bio: bio || null,
                onboardingDone: true,   // ✅ correct field name from schema
            }
        });

        // Upsert PageSettings with defaults
        await prisma.pageSettings.upsert({
            where: { userId },
            update: {},
            create: {
                userId,
                primaryColor: "#5C4EFA",
                accentColor: "#C6FF4E",
                theme: "midnight",
                layout: [
                    { id: "1", type: "ABOUT", enabled: true, title: "About Me" },
                    { id: "2", type: "PRODUCTS", enabled: true, title: "My Products" },
                    { id: "3", type: "EMAIL", enabled: true, title: "Join My List" },
                ],
                socialLinks: {},
            }
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Onboarding Persistence Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
