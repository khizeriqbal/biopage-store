import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const affiliates = await prisma.affiliateLink.findMany({
        where: { userId: session.user.id },
        include: {
            _count: { select: { orders: true, earnings: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(affiliates);
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { affiliateEmail, affiliateName, commissionPercent } = await req.json();

    if (!affiliateEmail) {
        return NextResponse.json({ error: "Affiliate email is required" }, { status: 400 });
    }

    const code = nanoid(8).toUpperCase();

    const link = await prisma.affiliateLink.create({
        data: {
            userId: session.user.id,
            affiliateEmail,
            affiliateName,
            code,
            commissionPercent: commissionPercent ? parseFloat(commissionPercent) : 30,
        },
    });

    return NextResponse.json(link, { status: 201 });
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.affiliateLink.deleteMany({ where: { id, userId: session.user.id } });
    return NextResponse.json({ success: true });
}
