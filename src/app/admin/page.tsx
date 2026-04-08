import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { TrendingUp, Users, ShoppingCart, DollarSign, BarChart3, AlertCircle, Package } from "lucide-react";

export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
    title: "Dashboard | Admin Panel",
};

async function getAdminStats() {
    const [users, products, orders, totalRevenue, affiliates, reviews] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.aggregate({
            _sum: { amount: true },
        }),
        prisma.affiliateLink.count(),
        prisma.review.count(),
    ]);

    const avgOrderValue = orders > 0 ? (totalRevenue._sum.amount || 0) / orders : 0;

    return {
        users,
        products,
        orders,
        totalRevenue: totalRevenue._sum.amount || 0,
        avgOrderValue,
        affiliates,
        reviews,
    };
}

export default async function AdminDashboard() {
    const stats = await getAdminStats();

    const kpis = [
        { label: "Total Users", value: stats.users, icon: Users, color: "from-blue-500 to-blue-600" },
        { label: "Total Products", value: stats.products, icon: Package, color: "from-purple-500 to-purple-600" },
        { label: "Total Orders", value: stats.orders, icon: ShoppingCart, color: "from-green-500 to-green-600" },
        { label: "Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "from-yellow-500 to-yellow-600" },
        { label: "Avg Order Value", value: `$${stats.avgOrderValue.toFixed(2)}`, icon: BarChart3, color: "from-orange-500 to-orange-600" },
        { label: "Affiliates", value: stats.affiliates, icon: TrendingUp, color: "from-pink-500 to-pink-600" },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">Overview of your bio page.store business</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kpis.map((kpi, idx) => {
                    const Icon = kpi.icon;
                    return (
                        <div
                            key={idx}
                            className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm hover:border-border/80 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${kpi.color} p-2.5`}>
                                    <Icon className="h-full w-full text-white" />
                                </div>
                                <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">
                                    {kpi.label}
                                </span>
                            </div>
                            <p className="text-3xl font-black text-white">{kpi.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-4">Pending Approvals</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-border/30">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-yellow-400" />
                                <span className="text-sm text-white/80">JV Partner Applications</span>
                            </div>
                            <span className="text-xs font-bold bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
                                View
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-border/30">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-orange-400" />
                                <span className="text-sm text-white/80">Pending Reviews</span>
                            </div>
                            <span className="text-xs font-bold bg-orange-500/20 text-orange-300 px-2 py-1 rounded">
                                View
                            </span>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-4">System Status</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-border/30">
                            <span className="text-sm text-white/80">Database Connection</span>
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-border/30">
                            <span className="text-sm text-white/80">Whop Payment Gateway</span>
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-border/30">
                            <span className="text-sm text-white/80">Email Service (Resend)</span>
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white mb-4">Recent Orders</h3>
                <div className="text-sm text-muted-foreground text-center py-8">
                    <p>Last 10 orders will appear here. System tracking enabled.</p>
                </div>
            </div>
        </div>
    );
}
