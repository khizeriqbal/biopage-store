import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const coupons = await prisma.coupon.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { orders: true } } },
    });

    return NextResponse.json(coupons);
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { code, discountType, discountValue, maxUses, expiresAt, productIds } = body;

    if (!code || !discountValue) {
        return NextResponse.json({ error: "Code and discount value are required" }, { status: 400 });
    }

    const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (existing) {
        return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    }

    const coupon = await prisma.coupon.create({
        data: {
            userId: session.user.id,
            code: code.toUpperCase(),
            discountType: discountType || "PERCENT",
            discountValue: parseFloat(discountValue),
            maxUses: maxUses ? parseInt(maxUses) : null,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            productIds: productIds || [],
        },
    });

    return NextResponse.json(coupon, { status: 201 });
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.coupon.deleteMany({ where: { id, userId: session.user.id } });
    return NextResponse.json({ success: true });
}
