import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    formatPrice,
    formatCompactNumber
} from "@/lib/utils";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Share2,
    BarChart2,
    Send,
    Zap
} from "lucide-react";
import Link from "next/link";
import {
    startOfMonth,
    endOfMonth,
    subDays,
    format,
    startOfDay
} from "date-fns";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return null;

    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    // Total Revenue
    const totalRevenueData = await prisma.order.aggregate({
        where: {
            sellerId: userId,
            status: "COMPLETED"
        },
        _sum: { amount: true }
    });
    const totalRevenue = totalRevenueData._sum.amount || 0;

    // This Month Revenue
    const monthRevenueData = await prisma.order.aggregate({
        where: {
            sellerId: userId,
            status: "COMPLETED",
            createdAt: {
                gte: startOfCurrentMonth,
                lte: endOfCurrentMonth
            }
        },
        _sum: { amount: true }
    });
    const monthRevenue = monthRevenueData._sum.amount || 0;

    // Weekly Views (Analytics)
    const sevenDaysAgo = subDays(startOfDay(now), 7);
    const analytics = await prisma.analytics.findMany({
        where: {
            userId,
            date: { gte: sevenDaysAgo }
        }
    });
    const weeklyViews = analytics.reduce((acc, curr) => acc + curr.pageViews, 0);

    // Subscribers
    const subscriberCount = await prisma.subscriber.count({
        where: { userId }
    });

    // Recent Orders
    const recentOrders = await prisma.order.findMany({
        where: { sellerId: userId },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { product: { select: { title: true } } }
    });

    // Chart Data (30 days)
    const thirtyDaysAgo = subDays(startOfDay(now), 30);
    const dailyRevenue = await prisma.order.groupBy({
        by: ["createdAt"],
        where: {
            sellerId: userId,
            status: "COMPLETED",
            createdAt: { gte: thirtyDaysAgo }
        },
        _sum: { amount: true }
    });

    // Format chart data for Recharts
    const chartData = Array.from({ length: 30 }).map((_, i) => {
        const d = subDays(now, 29 - i);
        const dateStr = format(d, "yyyy-MM-dd");
        const dayRev = dailyRevenue.find(r => format(r.createdAt, "yyyy-MM-dd") === dateStr);
        return {
            date: dateStr,
            revenue: dayRev?._sum.amount || 0
        };
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                    Good morning, {session.user?.name?.split(" ")[0]} 👋
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                    {weeklyViews > 0
                        ? `Your page has ${formatCompactNumber(weeklyViews)} views this week.`
                        : "No views yet this week. Share your link to get started!"}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={formatPrice(totalRevenue)}
                    description="Lifetime earnings"
                    trend={{ value: 12, isUp: true }} // Placeholder trend for now
                />
                <StatsCard
                    title="This Month"
                    value={formatPrice(monthRevenue)}
                    description={format(now, "MMMM yyyy")}
                />
                <StatsCard
                    title="Weekly Views"
                    value={formatCompactNumber(weeklyViews)}
                    description="Last 7 days"
                    trend={{ value: 5, isUp: false }}
                />
                <StatsCard
                    title="Subscribers"
                    value={formatCompactNumber(subscriberCount)}
                    description="Email list"
                />
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-4">
                <RevenueChart data={chartData} />
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <RecentOrders orders={recentOrders as any} />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white tracking-tight">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/dashboard/products" className="group">
                            <div className="h-full border border-border bg-surface-raised/40 p-4 rounded-xl transition-all hover:bg-surface-hover/60 hover:border-brand/40 flex flex-col items-center justify-center gap-2 text-center pointer-events-auto">
                                <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                                    <Plus className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium text-white group-hover:text-brand">Add Product</span>
                            </div>
                        </Link>
                        <Button variant="outline" className="h-full min-h-[120px] bg-surface-raised/40 border-border hover:bg-surface-hover/60 flex flex-col gap-2">
                            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                <Share2 className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium">Share Page</span>
                        </Button>
                        <Link href="/dashboard/analytics" className="group">
                            <div className="h-full border border-border bg-surface-raised/40 p-4 rounded-xl transition-all hover:bg-surface-hover/60 hover:border-brand/40 flex flex-col items-center justify-center gap-2 text-center">
                                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <BarChart2 className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium text-white">Analytics</span>
                            </div>
                        </Link>
                        <Link href="/dashboard/email-list" className="group">
                            <div className="h-full border border-border bg-surface-raised/40 p-4 rounded-xl transition-all hover:bg-surface-hover/60 hover:border-brand/40 flex flex-col items-center justify-center gap-2 text-center">
                                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                    <Send className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium text-white">Send Email</span>
                            </div>
                        </Link>
                    </div>

                    <div className="p-4 rounded-xl bg-brand/10 border border-brand/20 flex items-start gap-4">
                        <Zap className="h-5 w-5 text-brand" />
                        <div>
                            <p className="text-sm font-semibold text-white">Pro Tip</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Creators who use AI to write their product descriptions sell 40% more on average.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
