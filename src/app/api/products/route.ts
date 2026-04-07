import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req: Request) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, type, description, price, comparePrice, coverImage, fileUrl } = await req.json();

        if (!title || !type) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const slug = slugify(title, { lower: true, strict: true }) + "-" + Math.random().toString(36).slice(2, 6);

        const product = await prisma.product.create({
            data: {
                userId,
                title,
                type,
                description,
                price: parseFloat(price) || 0,
                comparePrice: comparePrice ? parseFloat(comparePrice) : null,
                coverImage,
                fileUrl,
                slug,
                published: true,
            }
        });

        return NextResponse.json(product);
    } catch (err: any) {
        console.error("Product Creation Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const products = await prisma.product.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(products);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
