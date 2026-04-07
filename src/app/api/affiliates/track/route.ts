import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { code } = await req.json();
    if (!code) return NextResponse.json({ ok: true });

    await prisma.affiliateLink.updateMany({
        where: { code: code.toUpperCase() },
        data: { totalClicks: { increment: 1 } },
    });

    return NextResponse.json({ ok: true });
}
