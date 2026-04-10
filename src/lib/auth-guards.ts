import { NextRequest, NextResponse } from "next/server";
import { isAdminUser } from "./admin-utils";
import prisma from "@/lib/prisma";

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isAdmin: boolean;
}

/**
 * Verify Supabase JWT token from request
 */
export async function verifyToken(
  request: NextRequest
): Promise<{ sub?: string; email?: string } | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = authHeader.substring(7);
    // For Supabase JWTs, we'd need to verify against Supabase public key
    // This is a simplified version - in production use Supabase's verifyAuth
    const decoded = await jwtVerify(token, JWT_SECRET).catch(() => null);
    return decoded?.payload as any;
  } catch {
    return null;
  }
}

/**
 * Get admin user from Supabase user ID
 */
export async function getAdminUser(userId: string): Promise<AdminUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isAdmin: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email || "",
      name: user.name,
      role: user.role,
      isAdmin: user.isAdmin,
    };
  } catch {
    return null;
  }
}

/**
 * Require admin authentication on API routes
 * Returns 401 if not authenticated, 403 if not admin
 */
export async function requireAdminAuth(
  request: NextRequest,
  minRole: "admin" | "superadmin" = "admin"
): Promise<{
  user: AdminUser | null;
  response: NextResponse | null;
}> {
  // Get token from Authorization header
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Unauthorized: No auth header" },
        { status: 401 }
      ),
    };
  }

  // For Supabase, get the user ID from the token/cookie
  // This is a simplified approach - in production, use proper JWT verification
  let userId: string | null = null;

  // Try to get from cookie
  const cookies = request.cookies;
  // You might need to adjust this based on how Supabase stores the session
  const supabaseSession = cookies.get("supabase-auth-token");

  if (!supabaseSession && authHeader.startsWith("Bearer ")) {
    // Extract user ID from custom header if provided
    const userIdHeader = request.headers.get("x-user-id");
    userId = userIdHeader;
  }

  if (!userId) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      ),
    };
  }

  // Get user and check admin status
  const user = await getAdminUser(userId);

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Unauthorized: User not found" },
        { status: 401 }
      ),
    };
  }

  if (!isAdminUser(user.role)) {
    return {
      user,
      response: NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      ),
    };
  }

  if (minRole === "superadmin" && user.role !== "superadmin") {
    return {
      user,
      response: NextResponse.json(
        { error: "Forbidden: Superadmin access required" },
        { status: 403 }
      ),
    };
  }

  return {
    user,
    response: null,
  };
}

/**
 * Middleware wrapper for protecting API routes
 */
export function withAdminAuth(
  handler: (req: NextRequest, user: AdminUser) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const { user, response } = await requireAdminAuth(req);

    if (response) {
      return response;
    }

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
      return await handler(req, user);
    } catch (error) {
      console.error("API error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

/**
 * Get user ID from request (multiple sources)
 */
export function getUserIdFromRequest(request: NextRequest): string | null {
  // Try Authorization header
  const userIdHeader = request.headers.get("x-user-id");
  if (userIdHeader) return userIdHeader;

  // Try custom header
  const customHeader = request.headers.get("x-admin-id");
  if (customHeader) return customHeader;

  // Try from cookie
  const cookies = request.cookies;
  const sessionCookie = cookies.get("admin-session");
  if (sessionCookie) {
    try {
      const data = JSON.parse(sessionCookie.value);
      return data.userId || data.id;
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Get IP address from request
 */
export function getIpFromRequest(request: NextRequest): string | null {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    null
  );
}
