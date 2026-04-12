import { Metadata } from "next";
import { DollarSign, TrendingUp, Clock, Wallet, Award, Eye, Mail } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Creator Earnings | Admin Panel",
};

async function getCreatorEarnings() {
    try {
        const creators = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
            },
            where: {
                role: { in: ['user', 'creator'] }
            },
            orderBy: { createdAt: "desc" },
        });

        const creatorsWithEarnings = await Promise.all(
            creators.map(async (creator) => {
                const orders = await prisma.order.findMany({
                    where: {
                        user: { id: creator.id },
                        status: "completed"
                    },
                    select: { amount: true, createdAt: true }
                });

                const lifetimeEarnings = orders.reduce((sum, o) => sum + (o.amount * 0.70), 0);
                const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                const monthlyEarnings = orders
                    .filter(o => new Date(o.createdAt) > thirtyDaysAgo)
                    .reduce((sum, o) => sum + (o.amount * 0.70), 0);

                const productCount = await prisma.product.count({
                    where: { userId: creator.id }
                });

                return {
                    ...creator,
                    lifetimeEarnings,
                    monthlyEarnings,
                    productCount,
                    orderCount: orders.length,
                };
            })
        );

        const totalEarnings = creatorsWithEarnings.reduce((sum, c) => sum + c.lifetimeEarnings, 0);
        const totalMonthlyEarnings = creatorsWithEarnings.reduce((sum, c) => sum + c.monthlyEarnings, 0);
        const avgMonthlyEarnings = creatorsWithEarnings.length > 0
            ? totalEarnings / creatorsWithEarnings.length
            : 0;

        const topEarner = creatorsWithEarnings.length > 0
            ? creatorsWithEarnings.reduce((max, c) => c.lifetimeEarnings > max.lifetimeEarnings ? c : max)
            : null;

        creatorsWithEarnings.sort((a, b) => b.lifetimeEarnings - a.lifetimeEarnings);

        return {
            creators: creatorsWithEarnings,
            totalEarnings,
            totalMonthlyEarnings,
            avgMonthlyEarnings,
            topEarner,
        };
    } catch (error) {
        console.error("Error fetching creator earnings:", error);
        return {
            creators: [],
            totalEarnings: 0,
            totalMonthlyEarnings: 0,
            avgMonthlyEarnings: 0,
            topEarner: null,
        };
    }
}

export default async function CreatorEarningsPage() {
    const data = await getCreatorEarnings();

    return (
        <div className="space-y-8 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white mb-2">Creator Earnings</h1>
                <p className="text-muted-foreground">Monitor creator payouts and earnings performance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <DollarSign className="h-5 w-5 text-blue-400" />
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Total Paid Out</p>
                    <h3 className="text-3xl font-black text-white">${(data.totalEarnings / 1000).toFixed(1)}K</h3>
                    <p className="text-xs text-emerald-400 mt-2">All-time creator earnings</p>
                </div>

                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <Clock className="h-5 w-5 text-yellow-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">This Month</p>
                    <h3 className="text-3xl font-black text-yellow-400">${(data.totalMonthlyEarnings / 1000).toFixed(1)}K</h3>
                    <p className="text-xs text-yellow-400 mt-2">Current month earnings</p>
                </div>

                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <Wallet className="h-5 w-5 text-purple-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Average Per Creator</p>
                    <h3 className="text-3xl font-black text-purple-400">${data.avgMonthlyEarnings.toFixed(2)}</h3>
                    <p className="text-xs text-purple-400 mt-2">Lifetime average</p>
                </div>

                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <Award className="h-5 w-5 text-pink-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Top Earner</p>
                    <h3 className="text-3xl font-black text-pink-400">${(data.topEarner?.lifetimeEarnings || 0).toFixed(0)}</h3>
                    <p className="text-xs text-pink-400 mt-2">{data.topEarner?.username || 'N/A'}</p>
                </div>
            </div>

            {/* Earnings Breakdown */}
            <div className="card-modern">
                <h3 className="font-bold text-white text-lg mb-4">Platform Commission Split</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Creator Payouts (70%)</p>
                        <p className="text-2xl font-black text-emerald-400">${(data.totalEarnings / 1000).toFixed(1)}K</p>
                        <p className="text-xs text-emerald-400 mt-1">Paid to creators</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Platform Revenue (30%)</p>
                        <p className="text-2xl font-black text-blue-400">${((data.totalEarnings / 0.70 * 0.30) / 1000).toFixed(1)}K</p>
                        <p className="text-xs text-blue-400 mt-1">Platform keeps 30%</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
                        <p className="text-2xl font-black text-purple-400">${((data.totalEarnings / 0.70) / 1000).toFixed(1)}K</p>
                        <p className="text-xs text-purple-400 mt-1">Gross sales</p>
                    </div>
                </div>
            </div>

            {/* Top Earners Section */}
            {data.creators.length > 0 && (
                <div className="card-modern overflow-hidden">
                    <h3 className="font-bold text-white text-lg mb-4">Top 10 Earners</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10 bg-slate-800/50">
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Creator</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Email</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Lifetime Earnings</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">This Month</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Products</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Sales</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {data.creators.slice(0, 10).map((creator, index) => (
                                    <tr key={creator.id} className="hover:bg-white/5 transition">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-blue-purple flex items-center justify-center text-white text-xs font-bold">
                                                    {index + 1}
                                                </div>
                                                <p className="font-semibold text-white">{creator.username}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-white/70 text-xs">{creator.email}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-emerald-400" />
                                                <span className="font-semibold text-emerald-400">${creator.lifetimeEarnings.toFixed(2)}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-yellow-400 font-semibold">${creator.monthlyEarnings.toFixed(2)}</span>
                                        </td>
                                        <td className="py-4 px-4 text-white">{creator.productCount}</td>
                                        <td className="py-4 px-4 text-white">{creator.orderCount}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex gap-2">
                                                <button className="p-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button className="p-1.5 rounded-lg bg-slate-700/20 border border-white/10 text-white hover:bg-slate-700/40 transition">
                                                    <Mail className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* All Creators Table */}
            {data.creators.length > 0 && (
                <div className="card-modern overflow-hidden">
                    <h3 className="font-bold text-white text-lg mb-4">All Creators ({data.creators.length})</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10 bg-slate-800/50">
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Creator</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Lifetime Earnings</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">This Month</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Avg Per Sale</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Products</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Total Sales</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {data.creators.map((creator) => (
                                    <tr key={creator.id} className="hover:bg-white/5 transition">
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="font-semibold text-white">{creator.username}</p>
                                                <p className="text-xs text-muted-foreground">{creator.email}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-emerald-400 font-semibold">${creator.lifetimeEarnings.toFixed(2)}</td>
                                        <td className="py-4 px-4 text-yellow-400 font-semibold">${creator.monthlyEarnings.toFixed(2)}</td>
                                        <td className="py-4 px-4 text-blue-400">
                                            ${creator.orderCount > 0 ? (creator.lifetimeEarnings / creator.orderCount).toFixed(2) : '0.00'}
                                        </td>
                                        <td className="py-4 px-4 text-white">{creator.productCount}</td>
                                        <td className="py-4 px-4 text-white">{creator.orderCount}</td>
                                        <td className="py-4 px-4 text-muted-foreground text-xs">
                                            {new Date(creator.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {data.creators.length === 0 && (
                <div className="card-modern text-center py-12">
                    <p className="text-muted-foreground">No creator earnings data available yet</p>
                </div>
            )}

        </div>
    );
}
