import { whop } from "@/lib/whop";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { productId, buyerEmail, buyerName, couponCode, customAmount, affiliateCode } = await req.json();

        if (!productId || !buyerEmail) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { user: true }
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const seller = product.user;
        if (!seller.whopCompanyId) {
            return NextResponse.json({ error: "Seller has not connected Whop yet" }, { status: 400 });
        }

        // Calculate final price
        let finalPrice = product.price;

        // Handle Pay-What-You-Want pricing
        if (product.priceType === "MINIMUM" && customAmount) {
            const minPrice = product.minPrice || product.price;
            finalPrice = Math.max(parseFloat(customAmount), minPrice);
        } else if (product.priceType === "FREE") {
            finalPrice = customAmount ? parseFloat(customAmount) : 0;
        }

        // Apply coupon if provided
        let couponId: string | undefined;
        if (couponCode && finalPrice > 0) {
            const coupon = await prisma.coupon.findUnique({
                where: { code: couponCode.toUpperCase() }
            });

            if (coupon && coupon.active && coupon.userId === seller.id) {
                const notExpired = !coupon.expiresAt || new Date() <= coupon.expiresAt;
                const hasUses = !coupon.maxUses || coupon.usedCount < coupon.maxUses;
                const appliesToProduct = coupon.productIds.length === 0 || coupon.productIds.includes(productId);

                if (notExpired && hasUses && appliesToProduct) {
                    if (coupon.discountType === "PERCENT") {
                        finalPrice = finalPrice * (1 - coupon.discountValue / 100);
                    } else {
                        finalPrice = Math.max(0, finalPrice - coupon.discountValue);
                    }
                    couponId = coupon.id;
                    await prisma.coupon.update({
                        where: { id: coupon.id },
                        data: { usedCount: { increment: 1 } }
                    });
                }
            }
        }

        // Resolve affiliate link
        let affiliateLinkId: string | undefined;
        if (affiliateCode) {
            const link = await prisma.affiliateLink.findUnique({
                where: { code: affiliateCode.toUpperCase() }
            });
            if (link && link.userId === seller.id && link.approved) {
                affiliateLinkId = link.id;
            }
        }

        // Free product flow — skip Whop checkout
        if (finalPrice === 0) {
            const order = await prisma.order.create({
                data: {
                    productId,
                    sellerId: seller.id,
                    amount: 0,
                    buyerEmail,
                    buyerName: buyerName || "Anonymous",
                    status: "COMPLETED",
                    currency: "USD",
                    whopSessionId: `free_${Date.now()}_${Math.random()}`,
                    couponId,
                    affiliateLinkId,
                }
            });
            await prisma.product.update({
                where: { id: productId },
                data: { salesCount: { increment: 1 } }
            });
            return NextResponse.json({ free: true, orderId: order.id });
        }

        // Create PENDING order
        const order = await prisma.order.create({
            data: {
                productId,
                sellerId: seller.id,
                amount: finalPrice,
                buyerEmail,
                buyerName: buyerName || "Anonymous",
                status: "PENDING",
                currency: "USD",
                whopSessionId: `pending_${Date.now()}_${Math.random()}`,
                couponId,
                affiliateLinkId,
            }
        });

        // Create Whop Checkout
        const checkoutConfig = await whop.checkoutConfigurations.create({
            plan: {
                company_id: seller.whopCompanyId,
                initial_price: Math.round(finalPrice * 100) / 100,
                plan_type: 'one_time',
                currency: 'usd',
            },
            metadata: {
                orderId: order.id,
                productId,
                sellerId: seller.id,
            },
            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/access/${order.id}`.replace('http://', 'https://'),
        });

        await prisma.order.update({
            where: { id: order.id },
            data: { whopSessionId: checkoutConfig.id }
        });

        return NextResponse.json({ url: `https://whop.com/checkout/${checkoutConfig.id}` });
    } catch (err: any) {
        console.error("Whop Checkout Error:", err);
        return NextResponse.json({ error: err.message || "Checkout failed" }, { status: 500 });
    }
}
