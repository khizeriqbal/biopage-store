import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { sendWelcome } from "@/lib/mail";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, name, productId, creatorId } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        let userId: string | null = null;
        let creatorName: string = "Creator";

        if (productId) {
            const product = await prisma.product.findUnique({
                where: { id: productId },
                include: { user: true }
            });
            if (product) {
                userId = product.user.id;
                creatorName = product.user.name || product.user.username;
            }
        }

        if (!userId && creatorId) {
            userId = creatorId;
            const user = await prisma.user.findUnique({ where: { id: userId } });
            creatorName = user?.name || user?.username || "Creator";
        }

        if (!userId) {
            return NextResponse.json({ error: "Target creator not found" }, { status: 404 });
        }

        // Upsert subscriber
        await prisma.subscriber.upsert({
            where: { userId_email: { userId, email } },
            create: {
                email,
                name: name || "Subscriber",
                userId,
                source: productId ? "PRODUCT" : "BIO_PAGE",
            },
            update: {},
        });

        // Send welcome email (fire-and-forget)
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user) {
            sendWelcome({
                email,
                creatorName,
                bioLink: `${process.env.NEXT_PUBLIC_APP_URL}/${user.username}`
            }).catch(() => {});
        }

        // Enroll in SUBSCRIBER_JOIN email sequences (fire-and-forget)
        prisma.emailSequence.findMany({
            where: { userId, trigger: "SUBSCRIBER_JOIN", active: true },
            include: { steps: { orderBy: { position: "asc" }, take: 1 } }
        }).then(async (sequences) => {
            for (const seq of sequences) {
                const firstStep = seq.steps[0];
                const nextSendAt = firstStep
                    ? new Date(Date.now() + firstStep.delayDays * 24 * 60 * 60 * 1000)
                    : null;
                await prisma.sequenceEnrollment.upsert({
                    where: { sequenceId_email: { sequenceId: seq.id, email } },
                    create: { sequenceId: seq.id, email, nextSendAt },
                    update: {},
                });
            }
        }).catch(() => {});

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Subscriber error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const subscribers = await prisma.subscriber.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(subscribers);
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.subscriber.deleteMany({ where: { id, userId: session.user.id } });
    return NextResponse.json({ success: true });
}
