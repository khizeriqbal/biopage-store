import { NextRequest, NextResponse } from "next/server";

/**
 * Emergency database initialization endpoint
 * Creates User table if it doesn't exist
 * This is a workaround for Prisma Accelerate not supporting db push
 */

const CREATE_TABLES_SQL = `
-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT,
  "email" TEXT UNIQUE,
  "emailVerified" TIMESTAMP(3),
  "image" TEXT,
  "password" TEXT,
  "username" TEXT UNIQUE,
  "bio" TEXT,
  "avatar" TEXT,
  "niche" TEXT,
  "onboardingDone" BOOLEAN NOT NULL DEFAULT false,
  "customDomain" TEXT UNIQUE,
  "domainVerified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Account table
CREATE TABLE IF NOT EXISTS "Account" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  UNIQUE("provider", "providerAccountId")
);

-- Create Session table
CREATE TABLE IF NOT EXISTS "Session" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create VerificationToken table
CREATE TABLE IF NOT EXISTS "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expires" TIMESTAMP(3) NOT NULL,
  UNIQUE("identifier", "token")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "Account_userId_idx" on "Account"("userId");
CREATE INDEX IF NOT EXISTS "Session_userId_idx" on "Session"("userId");
`;

export async function POST(req: NextRequest) {
  // Security: only allow from internal requests or specific auth
  const authHeader = req.headers.get("authorization");
  const secret = process.env.INIT_DB_SECRET || "dev-secret";

  if (process.env.NODE_ENV === "production") {
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  try {
    console.log("[INIT_DB] Checking database schema...");

    // Try to query users table
    try {
      const user = await prisma.user.findFirst({ take: 1 });
      return NextResponse.json(
        { message: "Database schema already exists" },
        { status: 200 }
      );
    } catch (error: any) {
      if (error.code === "P2021") {
        // Table doesn't exist
        console.log("[INIT_DB] Tables not found. Attempting to create...");

        // Use raw query to create tables
        try {
          await prisma.$executeRawUnsafe(CREATE_TABLES_SQL);
          console.log("[INIT_DB] Database tables created successfully");

          return NextResponse.json(
            { message: "Database schema initialized successfully" },
            { status: 201 }
          );
        } catch (createError: any) {
          console.error("[INIT_DB] Failed to create tables:", createError);
          return NextResponse.json(
            {
              error: "Failed to initialize database",
              details: createError.message
            },
            { status: 500 }
          );
        }
      } else {
        throw error;
      }
    }
  } catch (error: any) {
    console.error("[INIT_DB] Error:", error);
    return NextResponse.json(
      { error: error.message || "Database initialization failed" },
      { status: 500 }
    );
  }
}
