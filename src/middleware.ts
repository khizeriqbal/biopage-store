import { NextRequest, NextResponse } from "next/server";

// Get the main app hostname
const getMainHostname = () => {
    try {
        if (process.env.NEXTAUTH_URL) {
            return new URL(process.env.NEXTAUTH_URL).hostname;
        }
        if (process.env.NEXT_PUBLIC_APP_URL) {
            return new URL(process.env.NEXT_PUBLIC_APP_URL).hostname;
        }
    } catch (e) {
        // Fallback if URL parsing fails
    }
    return "biopage.store";
};

const PUBLIC_APP_HOSTNAME = getMainHostname();

export function middleware(req: NextRequest) {
    const { pathname, host } = req.nextUrl;

    // Extract hostname without port
    const hostname = host?.split(":")[0];

    // Allow localhost and vercel preview deployments
    const isVercelDeployment = hostname?.includes("vercel.app");
    const isMainDomain = hostname === PUBLIC_APP_HOSTNAME || hostname === "localhost" || isVercelDeployment;

    // If the hostname is NOT the main app domain and NOT a Vercel deployment, it could be a custom domain
    if (hostname && !isMainDomain && !isVercelDeployment) {
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
