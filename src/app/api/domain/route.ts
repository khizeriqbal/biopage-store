import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import dns from "dns/promises";

export const dynamic = 'force-dynamic';

const CNAME_TARGET = process.env.CNAME_TARGET || "cname.biopage.store";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { customDomain: true, domainVerified: true, plan: true },
    });

    return NextResponse.json(user);
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { domain } = await req.json();
    if (!domain) return NextResponse.json({ error: "Domain is required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.plan === "FREE") {
        return NextResponse.json({ error: "Custom domain requires STARTER plan or above" }, { status: 403 });
    }

    const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");

    await prisma.user.update({
        where: { id: session.user.id },
        data: { customDomain: cleanDomain, domainVerified: false },
    });

    return NextResponse.json({
        domain: cleanDomain,
        cnameTarget: CNAME_TARGET,
        instructions: `Add a CNAME record: ${cleanDomain} → ${CNAME_TARGET}`,
    });
}

export async function DELETE() {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.user.update({
        where: { id: session.user.id },
        data: { customDomain: null, domainVerified: false },
    });

    return NextResponse.json({ success: true });
}
