import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sequences = await prisma.emailSequence.findMany({
        where: { userId: session.user.id },
        include: {
            steps: { orderBy: { position: "asc" } },
            _count: { select: { enrollments: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(sequences);
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, trigger, steps } = await req.json();

    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const sequence = await prisma.emailSequence.create({
        data: {
            userId: session.user.id,
            name,
            trigger: trigger || "SUBSCRIBER_JOIN",
            steps: {
                create: (steps || []).map((s: any, i: number) => ({
                    subject: s.subject,
                    body: s.body,
                    delayDays: parseInt(s.delayDays) || 0,
                    position: i,
                })),
            },
        },
        include: { steps: { orderBy: { position: "asc" } } },
    });

    return NextResponse.json(sequence, { status: 201 });
}

export async function PATCH(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, active, name } = await req.json();

    await prisma.emailSequence.updateMany({
        where: { id, userId: session.user.id },
        data: { ...(active !== undefined ? { active } : {}), ...(name ? { name } : {}) },
    });

    return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.emailSequence.deleteMany({ where: { id, userId: session.user.id } });
    return NextResponse.json({ success: true });
}
