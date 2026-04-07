import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { code, productId, sellerId } = await req.json();

    if (!code || !productId || !sellerId) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
        where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.active || coupon.userId !== sellerId) {
        return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
        return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    if (coupon.productIds.length > 0 && !coupon.productIds.includes(productId)) {
        return NextResponse.json({ error: "Coupon not valid for this product" }, { status: 400 });
    }

    return NextResponse.json({
        valid: true,
        couponId: coupon.id,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
    });
}
