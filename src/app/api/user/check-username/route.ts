import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username")?.toLowerCase();

    if (!username || username.length < 3) {
        return NextResponse.json({ available: false, reason: "too_short" });
    }

    // Validate characters
    if (!/^[a-z0-9_]+$/.test(username)) {
        return NextResponse.json({ available: false, reason: "invalid_chars" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { username },
            select: { id: true },
        });

        // Explicit: if no user found, it's available
        return NextResponse.json({ available: user === null, reason: user ? "taken" : "ok" });
    } catch (error: any) {
        console.error("check-username DB error:", error?.message || error);
        // Return a distinct status so the UI can handle it properly
        return NextResponse.json(
            { available: null, reason: "db_error", error: error?.message },
            { status: 503 }
        );
    }
}
