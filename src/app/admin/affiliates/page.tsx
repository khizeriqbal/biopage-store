import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { TrendingUp, Copy, Eye, DollarSign, MousePointerClick } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Affiliates | Admin Panel",
};

async function getAffiliates() {
    try {
        const affiliates = await prisma.affiliateLink.findMany({
            select: {
                id: true,
                code: true,
                clicks: true,
                createdAt: true,
                user: {
                    select: {
                        email: true,
                        username: true,
                    },
                },
                orders: {
                    select: {
                        id: true,
                        amount: true,
                    },
                },
                earnings: {
                    select: {
                        amount: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        });

        return affiliates;
    } catch (error) {
        console.error("Error fetching affiliates:", error);
        return [];
    }
}

export default async function AffiliatesPage() {
    const affiliates = await getAffiliates();

    const totalClicks = affiliates.reduce((sum, a) => sum + a.clicks, 0);
    const totalEarnings = affiliates.reduce((sum, a) => sum + a.earnings.reduce((s, e) => s + e.amount, 0), 0);
    const totalConversions = affiliates.reduce((sum, a) => sum + a.orders.length, 0);

    return (
        <div className="space-y-8">
            {/* Header & Stats */}
            <div>
                <h1 className="text-3xl font-black text-white mb-6">Affiliates</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Total Affiliates</p>
                        <p className="text-3xl font-black text-white">{affiliates.length}</p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Total Clicks</p>
                        <p className="text-3xl font-black text-blue-400">{totalClicks}</p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Total Conversions</p>
                        <p className="text-3xl font-black text-green-400">{totalConversions}</p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Total Earnings Owed</p>
                        <p className="text-3xl font-black text-yellow-400">${totalEarnings.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Affiliates Table */}
            <div className="rounded-xl border border-border/50 bg-surface-raised/50 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/30 bg-black/30">
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Affiliate
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Code
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Clicks
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Conversions
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Earnings
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Joined
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {affiliates.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                        No affiliates yet
                                    </td>
                                </tr>
                            ) : (
                                affiliates.map((affiliate) => (
                                    <tr key={affiliate.id} className="hover:bg-black/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4 text-muted-foreground/50" />
                                                <div>
                                                    <p className="text-sm font-medium text-white">
                                                        {affiliate.user.username || affiliate.user.email}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">{affiliate.user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-sm bg-black/30 px-3 py-1 rounded text-white">
                                                {affiliate.code}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <MousePointerClick className="h-4 w-4 text-blue-400" />
                                                <span className="text-sm text-white">{affiliate.clicks}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Eye className="h-4 w-4 text-green-400" />
                                                <span className="text-sm text-white">{affiliate.orders.length}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-yellow-400" />
                                                <span className="text-sm font-semibold text-white">
                                                    ${affiliate.earnings.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {new Date(affiliate.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
