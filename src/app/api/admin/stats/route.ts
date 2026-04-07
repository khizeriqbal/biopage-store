import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        await requireAdmin();

        const [
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            totalAffiliates,
            totalReviews,
            jvPartnersPending,
            jvPartnersApproved,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.product.count(),
            prisma.order.count(),
            prisma.order.aggregate({ _sum: { amount: true } }),
            prisma.affiliateLink.count(),
            prisma.review.count(),
            prisma.jvPartner.count({ where: { approved: false } }),
            prisma.jvPartner.count({ where: { approved: true } }),
        ]);

        const avgOrderValue =
            totalOrders > 0 ? (totalRevenue._sum.amount || 0) / totalOrders : 0;

        return NextResponse.json({
            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue: totalRevenue._sum.amount || 0,
                avgOrderValue,
                totalAffiliates,
                totalReviews,
                jvPartnersPending,
                jvPartnersApproved,
            },
        });
    } catch (error: any) {
        console.error("Admin stats error:", error);
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
