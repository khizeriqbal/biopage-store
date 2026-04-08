import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import dns from "dns/promises";

export const dynamic = 'force-dynamic';

const CNAME_TARGET = process.env.CNAME_TARGET || "cname.biopage.store";

export async function POST() {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { customDomain: true },
    });

    if (!user?.customDomain) {
        return NextResponse.json({ error: "No custom domain set" }, { status: 400 });
    }

    try {
        const addresses = await dns.resolveCname(user.customDomain);
        const isVerified = addresses.some((a) => a.toLowerCase().includes(CNAME_TARGET.toLowerCase()));

        if (isVerified) {
            await prisma.user.update({
                where: { id: session.user.id },
                data: { domainVerified: true },
            });
            return NextResponse.json({ verified: true });
        } else {
            return NextResponse.json({
                verified: false,
                message: `CNAME not pointing to ${CNAME_TARGET} yet. DNS may take up to 48 hours to propagate.`,
            });
        }
    } catch {
        return NextResponse.json({
            verified: false,
            message: "Could not resolve domain. Make sure you've added the CNAME record.",
        });
    }
}
