import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, type, description, price, comparePrice, coverImage, fileUrl, slug } = await req.json();

        // Verify ownership
        const product = await prisma.product.findUnique({
            where: { id: params.id }
        });

        if (!product || product.userId !== userId) {
            return NextResponse.json({ error: "Product not found or unauthorized" }, { status: 404 });
        }

        const updated = await prisma.product.update({
            where: { id: params.id },
            data: {
                title,
                type,
                description,
                priceBy: price ? parseFloat(price) : undefined,
                comparePriceBy: comparePrice ? parseFloat(comparePrice) : undefined,
                coverImageBy: coverImage,
                fileUrlBy: fileUrl,
                slugBy: slug,
            }
        });

        return NextResponse.json(updated);
    } catch (err: any) {
        console.error("Product Edit Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { published, featured } = await req.json();

        // Verify ownership
        const product = await prisma.product.findUnique({
            where: { id: params.id }
        });

        if (!product || product.userId !== userId) {
            return NextResponse.json({ error: "Product not found or unauthorized" }, { status: 404 });
        }

        const updated = await prisma.product.update({
            where: { id: params.id },
            data: { published, featured }
        });

        return NextResponse.json(updated);
    } catch (err: any) {
        console.error("Product Toggle Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify ownership
        const product = await prisma.product.findUnique({
            where: { id: params.id }
        });

        if (!product || product.userId !== userId) {
            return NextResponse.json({ error: "Product not found or unauthorized" }, { status: 404 });
        }

        await prisma.product.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Product Delete Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
