import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { orderId, rating, comment } = await req.json();

    if (!orderId || !rating) {
        return NextResponse.json({ error: "Order ID and rating are required" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
        return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { review: true },
    });

    if (!order || order.status !== "COMPLETED") {
        return NextResponse.json({ error: "Order not found or not completed" }, { status: 404 });
    }

    if (order.review) {
        return NextResponse.json({ error: "Review already submitted" }, { status: 409 });
    }

    const review = await prisma.review.create({
        data: {
            productId: order.productId,
            orderId,
            rating: parseInt(rating),
            comment,
            buyerEmail: order.buyerEmail,
            buyerName: order.buyerName,
            approved: false,
        },
    });

    return NextResponse.json(review, { status: 201 });
}
