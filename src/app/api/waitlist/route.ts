import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { productId, email, name } = await req.json();

    if (!productId || !email) {
        return NextResponse.json({ error: "Product ID and email are required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.waitlisted) {
        return NextResponse.json({ error: "Product not found or not in waitlist mode" }, { status: 404 });
    }

    const entry = await prisma.waitlist.upsert({
        where: { productId_email: { productId, email } },
        create: { productId, email, name },
        update: {},
    });

    return NextResponse.json(entry, { status: 201 });
}

// GET waitlist for a product (dashboard)
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    if (!productId) return NextResponse.json({ error: "Missing productId" }, { status: 400 });

    const entries = await prisma.waitlist.findMany({
        where: { productId },
        orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(entries);
}
