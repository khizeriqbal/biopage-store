import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, password, username } = await req.json();

        if (!email || !password || !username) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const normalizedUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');

        const existingEmail = await prisma.user.findUnique({
            where: { email },
        });

        if (existingEmail) {
            return NextResponse.json({ error: "Email already in use" }, { status: 400 });
        }

        const existingUsername = await prisma.user.findUnique({
            where: { username: normalizedUsername },
        });

        if (existingUsername) {
            return NextResponse.json({ error: "Username already taken" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username: normalizedUsername,
            },
        });

        return NextResponse.json({ success: true, userId: user.id });
    } catch (error: any) {
        console.error("Register Error:", error);
        return NextResponse.json({
            error: "Failed to create account",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
