import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// GET: dashboard - get reviews for seller's products
export async function GET() {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const reviews = await prisma.review.findMany({
        where: { product: { userId: session.user.id } },
        include: { product: { select: { title: true } } },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
}

// PATCH: approve/reject a review
export async function PATCH(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, approved } = await req.json();

    await prisma.review.updateMany({
        where: { id, product: { userId: session.user.id } },
        data: { approved },
    });

    return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.review.deleteMany({ where: { id, product: { userId: session.user.id } } });
    return NextResponse.json({ success: true });
}
