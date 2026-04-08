import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { email, password, username, name } = await req.json();

        // Validate input
        if (!email || !password || !username) {
            return NextResponse.json(
                { error: "Missing required fields (email, password, username)" },
                { status: 400 }
            );
        }

        // Validate email format
        if (!email.includes("@")) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Validate password length
        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Normalize and validate username
        const normalizedUsername = username.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');

        if (normalizedUsername.length < 3) {
            return NextResponse.json(
                { error: "Username must be at least 3 characters" },
                { status: 400 }
            );
        }

        // Check if email exists
        const existingEmail = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: { id: true }
        });

        if (existingEmail) {
            return NextResponse.json(
                { error: "Email already in use" },
                { status: 400 }
            );
        }

        // Check if username exists
        const existingUsername = await prisma.user.findUnique({
            where: { username: normalizedUsername },
            select: { id: true }
        });

        if (existingUsername) {
            return NextResponse.json(
                { error: "Username already taken" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                username: normalizedUsername,
                name: name || username,
                onboardingDone: false,
                plan: "FREE",
            },
            select: { id: true, email: true, username: true }
        });

        return NextResponse.json({
            success: true,
            userId: user.id,
            message: "Account created successfully"
        }, { status: 201 });
    } catch (error: any) {
        console.error("Register Error:", error?.message || error);

        // Handle specific database errors
        if (error?.code === 'P2002') {
            const target = error?.meta?.target?.[0];
            return NextResponse.json(
                { error: `${target} is already in use` },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                error: "Failed to create account",
                message: "Please try again later"
            },
            { status: 500 }
        );
    }
}
