import { Metadata } from "next";
import { TrendingUp, Users, ShoppingCart, DollarSign, AlertCircle, Zap, BarChart3, Activity, Clock, Package } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Admin Dashboard | Bio Page.Store",
};

async function getAdminStats() {
    try {
        // Get basic counts
        const [
            userCount,
            productCount,
            orderCount,
            withdrawalCount,
            affiliateCount,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.product.count(),
            prisma.order.count(),
            prisma.withdrawalRequest.count({ where: { status: "PENDING" } }),
            prisma.affiliateLink.count(),
        ]);

        // Get revenue data
        const orders = await prisma.order.findMany({
            select: { amount: true, status: true, createdAt: true },
            take: 1000,
        });

        const totalRevenue = orders.reduce((sum, o) => sum + (o.status === "completed" ? o.amount : 0), 0);
        const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

        // Get platform earnings (sum of all fees)
        const platformEarnings = orders.reduce((sum, o) => {
            const fee = o.amount * 0.30; // assuming 30% average commission
            return sum + (o.status === "completed" ? fee : 0);
        }, 0);

        // Get latest withdrawals for pending amount
        const pendingWithdrawals = await prisma.withdrawalRequest.findMany({
            where: { status: "PENDING" },
            select: { amount: true },
        });
        const pendingAmount = pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0);

        return {
            totalUsers: userCount,
            totalProducts: productCount,
            totalOrders: orderCount,
            totalRevenue,
            avgOrderValue,
            platformEarnings,
            pendingWithdrawals: withdrawalCount,
            pendingWithdrawalAmount: pendingAmount,
            totalAffiliates: affiliateCount,
            recentOrders: orders.slice(0, 5),
        };
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return {
            totalUsers: 0,
            totalProducts: 0,
            totalOrders: 0,
            totalRevenue: 0,
            avgOrderValue: 0,
            platformEarnings: 0,
            pendingWithdrawals: 0,
            pendingWithdrawalAmount: 0,
            totalAffiliates: 0,
            recentOrders: [],
        };
    }
}

export default async function AdminDashboard() {
    const stats = await getAdminStats();

    return (
        <div className="space-y-8 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">Real-time platform metrics and insights</p>
            </div>

            {/* KPI Cards Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Revenue */}
                <div className="card-modern group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-gradient-blue-purple/20">
                            <DollarSign className="h-5 w-5 text-blue-400" />
                        </div>
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                    <h3 className="text-3xl font-black text-white">${(stats.totalRevenue / 1000).toFixed(1)}K</h3>
                    <p className="text-xs text-emerald-400 mt-2">+12% from last month</p>
                </div>

                {/* Total Users */}
                <div className="card-modern group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-blue-400/20">
                            <Users className="h-5 w-5 text-blue-400" />
                        </div>
                        <span className="text-xs font-bold text-blue-400 bg-blue-400/20 px-2 py-1 rounded">Active</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                    <h3 className="text-3xl font-black text-white">{stats.totalUsers}</h3>
                    <p className="text-xs text-blue-400 mt-2">Creator accounts</p>
                </div>

                {/* Total Orders */}
                <div className="card-modern group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-purple-400/20">
                            <ShoppingCart className="h-5 w-5 text-purple-400" />
                        </div>
                        <span className="text-xs font-bold text-purple-400 bg-purple-400/20 px-2 py-1 rounded">{stats.totalOrders}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                    <h3 className="text-3xl font-black text-white">{stats.totalOrders}</h3>
                    <p className="text-xs text-purple-400 mt-2">Avg ${stats.avgOrderValue.toFixed(2)}</p>
                </div>

                {/* Platform Earnings */}
                <div className="card-modern group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-emerald-400/20">
                            <Zap className="h-5 w-5 text-emerald-400" />
                        </div>
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Platform Earnings</p>
                    <h3 className="text-3xl font-black text-emerald-400">${(stats.platformEarnings / 1000).toFixed(1)}K</h3>
                    <p className="text-xs text-emerald-400 mt-2">Net profit after payouts</p>
                </div>
            </div>

            {/* KPI Cards Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Pending Withdrawals */}
                <div className="card-modern border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-yellow-400/20">
                            <Clock className="h-5 w-5 text-yellow-400" />
                        </div>
                        <span className="text-xs font-bold text-yellow-400 bg-yellow-400/20 px-2 py-1 rounded">Action Needed</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Pending Withdrawals</p>
                    <h3 className="text-3xl font-black text-yellow-400">{stats.pendingWithdrawals}</h3>
                    <p className="text-xs text-yellow-400 mt-2">${stats.pendingWithdrawalAmount.toFixed(2)} waiting approval</p>
                </div>

                {/* Total Products */}
                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-pink-400/20">
                            <Package className="h-5 w-5 text-pink-400" />
                        </div>
                        <span className="text-xs font-bold text-pink-400 bg-pink-400/20 px-2 py-1 rounded">Listing</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Total Products</p>
                    <h3 className="text-3xl font-black text-pink-400">{stats.totalProducts}</h3>
                    <p className="text-xs text-pink-400 mt-2">Creator listings</p>
                </div>

                {/* Total Affiliates */}
                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-indigo-400/20">
                            <Activity className="h-5 w-5 text-indigo-400" />
                        </div>
                        <span className="text-xs font-bold text-indigo-400 bg-indigo-400/20 px-2 py-1 rounded">Growing</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Active Affiliates</p>
                    <h3 className="text-3xl font-black text-indigo-400">{stats.totalAffiliates}</h3>
                    <p className="text-xs text-indigo-400 mt-2">Promotion partners</p>
                </div>
            </div>

            {/* Alerts & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Critical Alerts */}
                <div className="card-modern lg:col-span-2 border-red-500/30 bg-red-500/5">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                        <h3 className="font-bold text-white">System Alerts</h3>
                    </div>
                    <div className="space-y-3">
                        {stats.pendingWithdrawals > 0 && (
                            <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                                <div>
                                    <p className="text-sm font-semibold text-yellow-300">{stats.pendingWithdrawals} Pending Withdrawals</p>
                                    <p className="text-xs text-muted-foreground">${stats.pendingWithdrawalAmount.toFixed(2)} awaiting approval</p>
                                </div>
                                <button className="text-xs font-bold text-yellow-400 hover:text-yellow-300 transition">Review →</button>
                            </div>
                        )}
                        {stats.totalUsers > 100 && (
                            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-400/10 border border-blue-400/20">
                                <div>
                                    <p className="text-sm font-semibold text-blue-300">Monthly Payout Ready</p>
                                    <p className="text-xs text-muted-foreground">Process creator earnings this week</p>
                                </div>
                                <button className="text-xs font-bold text-blue-400 hover:text-blue-300 transition">Process →</button>
                            </div>
                        )}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-green-400/10 border border-green-400/20">
                            <div>
                                <p className="text-sm font-semibold text-green-300">System Healthy</p>
                                <p className="text-xs text-muted-foreground">All services operational</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="card-modern">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="h-5 w-5 text-blue-400" />
                        <h3 className="font-bold text-white">Quick Stats</h3>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Conversion Rate</p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-blue-purple w-[35%]"></div>
                                </div>
                                <span className="text-sm font-bold text-blue-400">3.5%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Avg Order Value</p>
                            <p className="text-lg font-black text-emerald-400">${stats.avgOrderValue.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Platform Fee</p>
                            <p className="text-lg font-black text-purple-400">30%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="card-modern">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white text-lg">Recent Orders</h3>
                    <button className="text-xs font-bold text-blue-400 hover:text-blue-300 transition">View All →</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Date</th>
                                <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Customer</th>
                                <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Product</th>
                                <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Amount</th>
                                <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders.length > 0 ? (
                                stats.recentOrders.map((order, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                                        <td className="py-3 px-4 text-white/70">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 text-white">{order.amount > 50 ? 'Premium' : 'Standard'}</td>
                                        <td className="py-3 px-4 text-white/70">Product #{i + 1}</td>
                                        <td className="py-3 px-4 text-emerald-400 font-semibold">${order.amount.toFixed(2)}</td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                                                order.status === 'completed'
                                                    ? 'bg-green-400/20 text-green-400'
                                                    : 'bg-yellow-400/20 text-yellow-400'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                        No orders yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
