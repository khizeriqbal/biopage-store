import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, email, skype, listSize } = await req.json();

        if (!name || !email) {
            return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
        }

        const existing = await prisma.jvPartner.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "You are already registered as a JV partner" }, { status: 409 });
        }

        const partner = await prisma.jvPartner.create({
            data: { name, email, skype, listSize },
        });

        return NextResponse.json({ success: true, id: partner.id }, { status: 201 });
    } catch (err: any) {
        console.error("JV signup error:", err);
        return NextResponse.json({ error: "Failed to register" }, { status: 500 });
    }
}

export async function GET() {
    const partners = await prisma.jvPartner.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(partners);
}
