import { Metadata } from "next";
import { TrendingUp, Users, ShoppingCart, Zap, BarChart3 } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Analytics | Creator Dashboard",
};

async function getAnalyticsData(userId: string) {
    try {
        const allOrders = await prisma.order.findMany({
            where: { product: { userId } },
            select: { amount: true, status: true, createdAt: true, product: { select: { name: true, id: true } } }
        });

        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const monthlyOrders = allOrders.filter(o => new Date(o.createdAt) > thirtyDaysAgo);

        const totalRevenue = allOrders.filter(o => o.status === "completed").reduce((sum, o) => sum + o.amount, 0);
        const monthlyRevenue = monthlyOrders.filter(o => o.status === "completed").reduce((sum, o) => sum + o.amount, 0);
        const monthlyOrderCount = monthlyOrders.filter(o => o.status === "completed").length;

        const products = await prisma.product.findMany({ where: { userId }, select: { id: true, name: true } });
        
        const productPerformance = await Promise.all(products.map(async (product) => {
            const orders = allOrders.filter(o => o.product.id === product.id && o.status === "completed");
            return { name: product.name, sales: orders.length, revenue: orders.reduce((sum, o) => sum + o.amount, 0) };
        }));

        productPerformance.sort((a, b) => b.revenue - a.revenue);

        return { totalRevenue, monthlyRevenue, monthlyOrderCount, productPerformance, products: products.length };
    } catch (error) {
        return { totalRevenue: 0, monthlyRevenue: 0, monthlyOrderCount: 0, productPerformance: [], products: 0 };
    }
}

export default async function AnalyticsDashboard() {
    const data = await getAnalyticsData("user-1");
    const avgOrderValue = data.monthlyOrderCount > 0 ? (data.monthlyRevenue / data.monthlyOrderCount).toFixed(2) : 0;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
                <p className="text-muted-foreground mt-2">Track store performance and revenue</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <TrendingUp className="h-5 w-5 text-emerald-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Monthly Revenue</p>
                    <h3 className="text-3xl font-bold text-white">${(data.monthlyRevenue / 1000).toFixed(1)}K</h3>
                    <p className="text-xs text-emerald-400 mt-2">Current month</p>
                </div>

                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <ShoppingCart className="h-5 w-5 text-blue-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
                    <h3 className="text-3xl font-bold text-white">{data.monthlyOrderCount}</h3>
                    <p className="text-xs text-blue-400 mt-2">Orders</p>
                </div>

                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <Users className="h-5 w-5 text-purple-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Avg Order Value</p>
                    <h3 className="text-3xl font-bold text-white">${avgOrderValue}</h3>
                    <p className="text-xs text-purple-400 mt-2">Per sale</p>
                </div>

                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <Zap className="h-5 w-5 text-yellow-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                    <h3 className="text-3xl font-bold text-white">${(data.totalRevenue / 1000).toFixed(1)}K</h3>
                    <p className="text-xs text-yellow-400 mt-2">All-time</p>
                </div>
            </div>

            <div className="card-modern">
                <h3 className="font-bold text-white text-lg mb-4">Revenue Overview</h3>
                <div className="h-40 flex items-end justify-center gap-2">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-16 bg-gradient-to-t from-blue-500/50 to-blue-400 rounded-t" />
                        <span className="text-xs text-muted-foreground mt-2">Week 1</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-24 bg-gradient-to-t from-blue-500/50 to-blue-400 rounded-t" />
                        <span className="text-xs text-muted-foreground mt-2">Week 2</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-32 bg-gradient-to-t from-blue-500/50 to-blue-400 rounded-t" />
                        <span className="text-xs text-muted-foreground mt-2">Week 3</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-28 bg-gradient-to-t from-blue-500/50 to-blue-400 rounded-t" />
                        <span className="text-xs text-muted-foreground mt-2">Week 4</span>
                    </div>
                </div>
            </div>

            {data.productPerformance.length > 0 && (
                <div className="card-modern">
                    <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-emerald-400" />
                        Top Products
                    </h3>
                    <div className="space-y-3">
                        {data.productPerformance.slice(0, 5).map((product, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/20">
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-white">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                                </div>
                                <p className="text-sm font-bold text-emerald-400">${(product.revenue / 1000).toFixed(1)}K</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
