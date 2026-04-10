import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Wallet, DollarSign, TrendingUp, Calendar } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Creator Earnings | Admin Panel",
};

async function getCreatorEarnings() {
    try {
        const wallets = await prisma.creatorWallet.findMany({
            select: {
                id: true,
                userId: true,
                balance: true,
                totalEarned: true,
                user: {
                    select: {
                        email: true,
                        username: true,
                    },
                },
            },
            orderBy: { totalEarned: "desc" },
            take: 100,
        });

        return wallets;
    } catch (error) {
        console.error("Error fetching creator earnings:", error);
        return [];
    }
}

export default async function CreatorEarningsPage() {
    const creators = await getCreatorEarnings();

    const totalEarnings = creators.reduce((sum, c) => sum + c.totalEarned, 0);
    const totalPayable = creators.reduce((sum, c) => sum + c.balance, 0);
    const totalCreators = creators.length;

    return (
        <div className="space-y-8">
            {/* Header & Stats */}
            <div>
                <h1 className="text-3xl font-black text-white mb-6">Creator Earnings</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Total Creators</p>
                        <p className="text-3xl font-black text-white">{totalCreators}</p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Total Earned (All Time)</p>
                        <p className="text-3xl font-black text-green-400">${totalEarnings.toFixed(2)}</p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Total Payable Now</p>
                        <p className="text-3xl font-black text-yellow-400">${totalPayable.toFixed(2)}</p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Avg Creator Earnings</p>
                        <p className="text-3xl font-black text-blue-400">
                            ${totalCreators > 0 ? (totalEarnings / totalCreators).toFixed(2) : "0.00"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Creator Earnings Table */}
            <div className="rounded-xl border border-border/50 bg-surface-raised/50 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/30 bg-black/30">
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Creator
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Total Earned
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Available Balance
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Pending Withdrawal
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {creators.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        No creator earnings yet
                                    </td>
                                </tr>
                            ) : (
                                creators.map((creator) => (
                                    <tr key={creator.id} className="hover:bg-black/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Wallet className="h-4 w-4 text-muted-foreground/50" />
                                                <div>
                                                    <p className="text-sm font-medium text-white">
                                                        {creator.user.username || creator.user.email}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">{creator.user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4 text-green-400" />
                                                <span className="text-sm font-semibold text-white">
                                                    ${creator.totalEarned.toFixed(2)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-yellow-400" />
                                                <span className="text-sm font-semibold text-white">
                                                    ${creator.balance.toFixed(2)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-white/80">
                                                $0.00
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button size="sm" variant="outline" className="h-8 text-xs">
                                                View Details
                                            </Button>
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
