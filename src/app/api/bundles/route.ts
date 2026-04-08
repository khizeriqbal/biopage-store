import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const bundles = await prisma.bundle.findMany({
        where: { userId: session.user.id },
        include: { items: { include: { product: { select: { id: true, title: true, price: true, coverImage: true } } } } },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bundles);
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, description, bundlePrice, productIds, coverImage } = await req.json();

    if (!name || !bundlePrice || !productIds?.length) {
        return NextResponse.json({ error: "Name, price and products are required" }, { status: 400 });
    }

    const bundle = await prisma.bundle.create({
        data: {
            userId: session.user.id,
            name,
            description,
            bundlePrice: parseFloat(bundlePrice),
            coverImage,
            items: {
                create: productIds.map((pid: string) => ({ productId: pid })),
            },
        },
        include: { items: { include: { product: true } } },
    });

    return NextResponse.json(bundle, { status: 201 });
}

export async function PATCH(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, published } = await req.json();

    const bundle = await prisma.bundle.updateMany({
        where: { id, userId: session.user.id },
        data: { published },
    });

    return NextResponse.json(bundle);
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.bundle.deleteMany({ where: { id, userId: session.user.id } });
    return NextResponse.json({ success: true });
}
