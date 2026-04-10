import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

async function initializeDatabaseIfNeeded() {
  try {
    // Try a simple query to check if tables exist
    await prisma.user.findFirst({ take: 1 });
  } catch (error: any) {
    if (error.code === "P2021") {
      // Table doesn't exist - try to initialize
      console.log("[SIGNUP] Database not initialized, attempting to create tables...");
      try {
        // Call the init-db endpoint
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const initSecret = process.env.INIT_DB_SECRET || "dev-secret";

        const response = await fetch(`${baseUrl}/api/init-db`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${initSecret}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("[SIGNUP] Database initialization failed:", response.status);
        } else {
          console.log("[SIGNUP] Database initialized successfully");
        }
      } catch (initError) {
        console.error("[SIGNUP] Error calling init-db:", initError);
      }
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, username, name } = await req.json();

    // Validate inputs
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Email, password, and username are required" },
        { status: 400 }
      );
    }

    // Initialize database if needed (first request after deployment)
    await initializeDatabaseIfNeeded();

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            existingUser.email === email
              ? "Email already in use"
              : "Username already taken",
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        name: name || email.split("@")[0],
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[SIGNUP_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
