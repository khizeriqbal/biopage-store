import { NextRequest, NextResponse } from "next/server";

const PUBLIC_APP_HOSTNAME = process.env.NEXT_PUBLIC_APP_URL
    ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname
    : "biopage.store";

export async function middleware(req: NextRequest) {
    const { pathname, host } = req.nextUrl;

    // Skip internal Next.js paths and API routes
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/favicon") ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/onboarding") ||
        pathname.startsWith("/access") ||
        pathname.startsWith("/review")
    ) {
        return NextResponse.next();
    }

    // If the hostname is NOT the main app domain, it could be a custom domain
    const hostname = host?.split(":")[0];
    if (hostname && hostname !== PUBLIC_APP_HOSTNAME && hostname !== "localhost") {
        // Rewrite to an internal handler that looks up user by custom domain
        const url = req.nextUrl.clone();
        url.pathname = `/domain${pathname}`;
        url.searchParams.set("customDomain", hostname);
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
