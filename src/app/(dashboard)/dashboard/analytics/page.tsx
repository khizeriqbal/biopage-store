import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    formatPrice,
    formatCompactNumber
} from "@/lib/utils";

export const dynamic = 'force-dynamic';
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ViewsChart } from "@/components/dashboard/ViewsChart";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    BarChart3,
    LineChart as LineChartIcon,
    TrendingUp,
    Package,
    ArrowUpRight
} from "lucide-react";
import {
    subDays,
    format,
    startOfDay
} from "date-fns";
import { Badge } from "@/components/ui/badge";

export default async function AnalyticsPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return null;

    const now = new Date();
    const thirtyDaysAgo = subDays(startOfDay(now), 30);

    // 1. Fetch Aggregated Daily Analytics
    const analyticsData = await prisma.analytics.findMany({
        where: {
            userId,
            date: { gte: thirtyDaysAgo }
        },
        orderBy: { date: "asc" }
    });

    // 2. Map Chart Data
    const chartData = Array.from({ length: 30 }).map((_, i) => {
        const d = subDays(now, 29 - i);
        const dateStr = format(d, "yyyy-MM-dd");
        const dayData = analyticsData.find(a => format(new Date(a.date), "yyyy-MM-dd") === dateStr);
        return {
            date: dateStr,
            views: dayData?.pageViews || 0,
            revenue: dayData?.totalRevenue || 0
        };
    });

    // 3. Totals
    const totalViews = analyticsData.reduce((acc, curr) => acc + curr.pageViews, 0);
    const totalRevenue = analyticsData.reduce((acc, curr) => acc + (curr.totalRevenue || 0), 0);

    // 4. Top Products
    const topProducts = await prisma.product.findMany({
        where: { userId },
        orderBy: { salesCount: "desc" },
        take: 5
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                    Performance Insights <BarChart3 className="h-6 w-6 text-accent" />
                </h1>
                <p className="text-muted-foreground">Detailed breakdown of your store's growth and sales in the last 30 days.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatsCard
                    title="30-Day Views"
                    value={formatCompactNumber(totalViews)}
                    description="Traffic activity"
                    trend={{ value: 15, isUp: true }}
                />
                <StatsCard
                    title="30-Day Revenue"
                    value={formatPrice(totalRevenue)}
                    description="Gross earnings"
                    trend={{ value: 8, isUp: true }}
                />
                <StatsCard
                    title="Conversion Rate"
                    value="4.2%"
                    description="View to purchase"
                    trend={{ value: 2, isUp: false }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ViewsChart data={chartData as any} />
                <RevenueChart data={chartData as any} />
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        Top Selling Products <Package className="h-5 w-5 text-brand" />
                    </h3>
                    <Badge variant="outline" className="border-border text-muted-foreground text-[10px] uppercase font-bold px-2 py-0.5">ALGORITHM RANK</Badge>
                </div>

                <div className="rounded-xl border border-border bg-surface-raised/40 backdrop-blur-md overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-border">
                                <TableHead className="text-muted-foreground font-medium py-4">Product</TableHead>
                                <TableHead className="text-muted-foreground font-medium py-4">Sales</TableHead>
                                <TableHead className="text-muted-foreground font-medium py-4">Revenue</TableHead>
                                <TableHead className="text-muted-foreground font-medium py-4 text-right">Growth</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic">No product data yet</TableCell>
                                </TableRow>
                            ) : (
                                topProducts.map((product) => (
                                    <TableRow key={product.id} className="hover:bg-surface-hover/50 border-border group transition-all">
                                        <TableCell className="py-4">
                                            <span className="font-semibold text-white group-hover:text-brand transition-colors">{product.title}</span>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">{product.type}</p>
                                        </TableCell>
                                        <TableCell className="py-4 font-bold text-white">{product.salesCount}</TableCell>
                                        <TableCell className="py-4 font-bold text-accent">{formatPrice(product.totalRevenue)}</TableCell>
                                        <TableCell className="py-4 text-right">
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-accent">
                                                <ArrowUpRight className="h-3 w-3" /> 12%
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
