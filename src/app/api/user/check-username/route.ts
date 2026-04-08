import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username")?.toLowerCase()?.trim();

        // Validation checks
        if (!username) {
            return NextResponse.json({
                available: false,
                reason: "empty",
                message: "Username is required"
            });
        }

        if (username.length < 3) {
            return NextResponse.json({
                available: false,
                reason: "too_short",
                message: "Username must be at least 3 characters"
            });
        }

        if (!/^[a-z0-9_]+$/.test(username)) {
            return NextResponse.json({
                available: false,
                reason: "invalid_chars",
                message: "Username can only contain letters, numbers, and underscores"
            });
        }

        // Check database
        const { prisma } = await import("@/lib/prisma");

        let isUsernameTaken = false;

        try {
            const existingUser = await prisma.user.findUnique({
                where: { username },
                select: { id: true }
            });

            isUsernameTaken = existingUser !== null;
        } catch (dbError: any) {
            console.error("Database error checking username:", dbError);
            // If database fails, assume available (let signup API handle the actual check)
            return NextResponse.json({
                available: true,
                reason: "db_check_skipped",
                message: "Could not verify availability, but you can try"
            });
        }

        // Return clear response
        return NextResponse.json({
            available: !isUsernameTaken,
            reason: isUsernameTaken ? "taken" : "available",
            message: isUsernameTaken ? "Username is already taken" : "Username is available"
        });

    } catch (error: any) {
        console.error("check-username error:", error);
        // Default to available on error - let registration API catch conflicts
        return NextResponse.json({
            available: true,
            reason: "error",
            message: "Could not check availability"
        });
    }
}
