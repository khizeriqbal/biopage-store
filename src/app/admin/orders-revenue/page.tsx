import { Metadata } from "next";
import { DollarSign, TrendingUp, BarChart3, PieChart as PieChartIcon, RefreshCw, Eye, Mail, RotateCcw } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Orders & Revenue | Admin Panel",
};

async function getOrdersAndRevenue() {
    try {
        const orders = await prisma.order.findMany({
            select: {
                id: true,
                amount: true,
                status: true,
                createdAt: true,
                customerEmail: true,
                customerName: true,
                product: {
                    select: {
                        name: true,
                        price: true,
                    },
                },
                user: {
                    select: {
                        username: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        });

        const totalRevenue = orders.reduce((sum, o) => sum + (o.status === "completed" ? o.amount : 0), 0);
        const completedOrders = orders.filter(o => o.status === "completed").length;
        const pendingOrders = orders.filter(o => o.status === "pending").length;
        const refundedOrders = orders.filter(o => o.status === "refunded").length;

        return {
            orders,
            totalRevenue,
            completedOrders,
            pendingOrders,
            refundedOrders,
        };
    } catch (error) {
        console.error("Error fetching orders:", error);
        return {
            orders: [],
            totalRevenue: 0,
            completedOrders: 0,
            pendingOrders: 0,
            refundedOrders: 0,
        };
    }
}

export default async function OrdersRevenuePage() {
    const data = await getOrdersAndRevenue();

    const avgOrderValue = data.orders.length > 0 ? data.totalRevenue / data.orders.length : 0;
    const conversionRate = data.orders.length > 0 ? ((data.completedOrders / data.orders.length) * 100).toFixed(1) : 0;

    return (
        <div className="space-y-8 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white mb-2">Orders & Revenue</h1>
                <p className="text-muted-foreground">Track all sales and financial metrics</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <DollarSign className="h-5 w-5 text-blue-400" />
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                    <h3 className="text-3xl font-black text-white">${(data.totalRevenue / 1000).toFixed(1)}K</h3>
                    <p className="text-xs text-emerald-400 mt-2">All-time earnings</p>
                </div>

                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <BarChart3 className="h-5 w-5 text-purple-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Average Order Value</p>
                    <h3 className="text-3xl font-black text-purple-400">${avgOrderValue.toFixed(2)}</h3>
                    <p className="text-xs text-purple-400 mt-2">Per transaction</p>
                </div>

                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <RefreshCw className="h-5 w-5 text-emerald-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Conversion Rate</p>
                    <h3 className="text-3xl font-black text-emerald-400">{conversionRate}%</h3>
                    <p className="text-xs text-emerald-400 mt-2">Completed orders</p>
                </div>

                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <PieChartIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                    <h3 className="text-3xl font-black text-blue-400">{data.orders.length}</h3>
                    <p className="text-xs text-blue-400 mt-2">All transactions</p>
                </div>
            </div>

            {/* Order Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-modern border-emerald-500/30 bg-emerald-500/5">
                    <p className="text-sm text-muted-foreground mb-1">Completed Orders</p>
                    <h3 className="text-3xl font-black text-emerald-400">{data.completedOrders}</h3>
                    <p className="text-xs text-emerald-400 mt-2">Successful transactions</p>
                </div>

                <div className="card-modern border-yellow-500/30 bg-yellow-500/5">
                    <p className="text-sm text-muted-foreground mb-1">Pending Orders</p>
                    <h3 className="text-3xl font-black text-yellow-400">{data.pendingOrders}</h3>
                    <p className="text-xs text-yellow-400 mt-2">Awaiting confirmation</p>
                </div>

                <div className="card-modern border-red-500/30 bg-red-500/5">
                    <p className="text-sm text-muted-foreground mb-1">Refunded Orders</p>
                    <h3 className="text-3xl font-black text-red-400">{data.refundedOrders}</h3>
                    <p className="text-xs text-red-400 mt-2">Refund processed</p>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="card-modern overflow-hidden">
                <h3 className="font-bold text-white text-lg mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10 bg-slate-800/50">
                                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Order ID</th>
                                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Customer</th>
                                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Product</th>
                                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Creator</th>
                                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Amount</th>
                                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Status</th>
                                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Date</th>
                                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data.orders.length > 0 ? (
                                data.orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition">
                                        <td className="py-4 px-4 font-mono text-xs text-white/70">{order.id.slice(0, 8)}</td>
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="text-sm text-white">{order.customerName || order.customerEmail}</p>
                                                <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="text-sm text-white">{order.product.name}</p>
                                            <p className="text-xs text-muted-foreground">${order.product.price}</p>
                                        </td>
                                        <td className="py-4 px-4 text-white text-sm">{order.user.username}</td>
                                        <td className="py-4 px-4 text-emerald-400 font-semibold">${order.amount.toFixed(2)}</td>
                                        <td className="py-4 px-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                                                order.status === 'completed' ? 'bg-emerald-400/20 text-emerald-400' :
                                                order.status === 'pending' ? 'bg-yellow-400/20 text-yellow-400' :
                                                'bg-red-400/20 text-red-400'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-muted-foreground text-xs">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex gap-2">
                                                <button className="p-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button className="p-1.5 rounded-lg bg-slate-700/20 border border-white/10 text-white hover:bg-slate-700/40 transition">
                                                    <Mail className="h-4 w-4" />
                                                </button>
                                                {order.status === 'completed' && (
                                                    <button className="p-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition">
                                                        <RotateCcw className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Commission Breakdown */}
            <div className="card-modern">
                <h3 className="font-bold text-white text-lg mb-4">Commission Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Platform Fee (30%)</p>
                        <p className="text-2xl font-black text-blue-400">${(data.totalRevenue * 0.30).toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Creator Earnings (70%)</p>
                        <p className="text-2xl font-black text-emerald-400">${(data.totalRevenue * 0.70).toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Total Commission Pool</p>
                        <p className="text-2xl font-black text-purple-400">${data.totalRevenue.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
