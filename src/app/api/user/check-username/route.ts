import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username")?.toLowerCase()?.trim();

    if (!username || username.length < 3) {
        return NextResponse.json({
            available: false,
            reason: "too_short",
            message: "Username must be at least 3 characters"
        });
    }

    // Validate characters (alphanumeric and underscore only)
    if (!/^[a-z0-9_]+$/.test(username)) {
        return NextResponse.json({
            available: false,
            reason: "invalid_chars",
            message: "Username can only contain letters, numbers, and underscores"
        });
    }

    try {
        // Check if username is already taken
        const existingUser = await prisma.user.findUnique({
            where: { username },
            select: { id: true },
        });

        // If user exists, username is taken; if not, it's available
        const isAvailable = existingUser === null;

        return NextResponse.json({
            available: isAvailable,
            reason: isAvailable ? "available" : "taken",
            message: isAvailable ? "Username is available" : "Username is already taken"
        });
    } catch (error: any) {
        console.error("check-username error:", error?.message || error);
        // On error, assume available is true (don't block user from trying to register)
        // The actual registration will fail if there's a real DB issue
        return NextResponse.json(
            {
                available: true,
                reason: "error_checking",
                message: "Could not verify username availability"
            },
            { status: 200 }
        );
    }
}
