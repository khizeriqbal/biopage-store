import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const signature = req.headers.get("whop-signature");
        const bodyText = await req.text();

        const whopSecret = process.env.WHOP_WEBHOOK_SECRET;
        if (!whopSecret || !signature) {
            return NextResponse.json({ error: "Missing Whop Signature" }, { status: 400 });
        }

        const hmac = crypto.createHmac("sha256", whopSecret);
        hmac.update(bodyText);
        const expectedSignature = hmac.digest("hex");

        if (signature !== expectedSignature) {
            return NextResponse.json({ error: "Invalid Signature" }, { status: 401 });
        }

        const event = JSON.parse(bodyText);

        if (event.action === "payment.succeeded" || event.action === "membership.went_valid") {
            const data = event.data;
            const checkoutConfigId = data.checkout_id;
            const metadata = data.metadata || {};

            // Platform subscription upgrade
            if (metadata.type === 'platform_subscription' && metadata.userId && metadata.plan) {
                await prisma.user.update({
                    where: { id: metadata.userId },
                    data: {
                        plan: metadata.plan,
                        planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    }
                });
                return NextResponse.json({ received: true, action: 'plan_upgraded' });
            }

            // Fan purchasing creator product
            if (checkoutConfigId) {
                const order = await prisma.order.findUnique({
                    where: { whopSessionId: checkoutConfigId },
                    include: { affiliateLink: true }
                });

                if (order && order.status === "PENDING") {
                    await prisma.order.update({
                        where: { id: order.id },
                        data: { status: "COMPLETED" }
                    });

                    await prisma.product.update({
                        where: { id: order.productId },
                        data: {
                            salesCount: { increment: 1 },
                            totalRevenue: { increment: order.amount }
                        }
                    });

                    // Credit affiliate if applicable
                    if (order.affiliateLinkId && order.affiliateLink) {
                        const commissionAmount = order.amount * (order.affiliateLink.commissionPercent / 100);
                        await prisma.affiliateEarning.create({
                            data: {
                                affiliateLinkId: order.affiliateLinkId,
                                orderId: order.id,
                                amount: commissionAmount,
                            }
                        });
                        await prisma.affiliateLink.update({
                            where: { id: order.affiliateLinkId },
                            data: { totalEarned: { increment: commissionAmount } }
                        });
                    }

                    // Enroll buyer into POST_PURCHASE email sequences
                    const sequences = await prisma.emailSequence.findMany({
                        where: {
                            userId: order.sellerId,
                            trigger: "POST_PURCHASE",
                            active: true,
                        },
                        include: { steps: { orderBy: { position: "asc" }, take: 1 } }
                    });

                    for (const seq of sequences) {
                        const firstStep = seq.steps[0];
                        const nextSendAt = firstStep
                            ? new Date(Date.now() + firstStep.delayDays * 24 * 60 * 60 * 1000)
                            : null;

                        await prisma.sequenceEnrollment.upsert({
                            where: { sequenceId_email: { sequenceId: seq.id, email: order.buyerEmail } },
                            create: { sequenceId: seq.id, email: order.buyerEmail, nextSendAt },
                            update: {},
                        });
                    }
                }
            }
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error("Whop Webhook Error:", err.message);
        return NextResponse.json({ error: "Webhook error" }, { status: 400 });
    }
}
