import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, DollarSign, Calendar } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Withdrawal Requests | Admin Panel",
};

async function getWithdrawalRequests() {
    try {
        const withdrawals = await prisma.withdrawalRequest.findMany({
            select: {
                id: true,
                amount: true,
                status: true,
                bankAccount: true,
                requestedAt: true,
                approvedAt: true,
                reason: true,
                user: {
                    select: {
                        email: true,
                        username: true,
                    },
                },
                approver: {
                    select: {
                        email: true,
                        username: true,
                    },
                },
            },
            orderBy: { requestedAt: "desc" },
            take: 100,
        });

        return withdrawals;
    } catch (error) {
        console.error("Error fetching withdrawal requests:", error);
        return [];
    }
}

export default async function WithdrawalRequestsPage() {
    const withdrawals = await getWithdrawalRequests();

    const pending = withdrawals.filter(w => w.status === "PENDING").length;
    const approved = withdrawals.filter(w => w.status === "APPROVED").length;
    const rejected = withdrawals.filter(w => w.status === "REJECTED").length;
    const completed = withdrawals.filter(w => w.status === "COMPLETED").length;
    const totalAmount = withdrawals.reduce((sum, w) => sum + w.amount, 0);
    const pendingAmount = withdrawals
        .filter(w => w.status === "PENDING")
        .reduce((sum, w) => sum + w.amount, 0);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return <div className="flex items-center gap-1"><Clock className="h-3 w-3" /><span>Pending</span></div>;
            case "APPROVED":
                return <div className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-yellow-400" /><span className="text-yellow-300">Approved</span></div>;
            case "COMPLETED":
                return <div className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-400" /><span className="text-green-300">Completed</span></div>;
            case "REJECTED":
                return <div className="flex items-center gap-1"><XCircle className="h-3 w-3 text-red-400" /><span className="text-red-300">Rejected</span></div>;
            default:
                return status;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header & Stats */}
            <div>
                <h1 className="text-3xl font-black text-white mb-6">Withdrawal Requests</h1>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Pending</p>
                        <p className="text-3xl font-black text-yellow-400">{pending}</p>
                        <p className="text-xs text-muted-foreground mt-2">${pendingAmount.toFixed(2)}</p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Approved</p>
                        <p className="text-3xl font-black text-yellow-400">{approved}</p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Completed</p>
                        <p className="text-3xl font-black text-green-400">{completed}</p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Rejected</p>
                        <p className="text-3xl font-black text-red-400">{rejected}</p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Total Amount</p>
                        <p className="text-3xl font-black text-blue-400">${totalAmount.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Withdrawal Requests Table */}
            <div className="rounded-xl border border-border/50 bg-surface-raised/50 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/30 bg-black/30">
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Creator
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Amount
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Bank Account
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Requested
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {withdrawals.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                        No withdrawal requests
                                    </td>
                                </tr>
                            ) : (
                                withdrawals.map((withdrawal) => (
                                    <tr key={withdrawal.id} className="hover:bg-black/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-white">
                                                    {withdrawal.user.username || withdrawal.user.email}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{withdrawal.user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-green-400" />
                                                <span className="text-sm font-semibold text-white">
                                                    ${withdrawal.amount.toFixed(2)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-white/80 truncate max-w-xs">
                                                {withdrawal.bankAccount || "Not specified"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-white/80 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(withdrawal.requestedAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold px-3 py-1 rounded flex items-center gap-1 w-fit ${
                                                withdrawal.status === "PENDING" ? "bg-yellow-500/20 text-yellow-300" :
                                                withdrawal.status === "APPROVED" ? "bg-yellow-500/20 text-yellow-300" :
                                                withdrawal.status === "COMPLETED" ? "bg-green-500/20 text-green-300" :
                                                "bg-red-500/20 text-red-300"
                                            }`}>
                                                {getStatusBadge(withdrawal.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 space-x-2">
                                            {withdrawal.status === "PENDING" && (
                                                <>
                                                    <Button size="sm" variant="outline" className="h-7 text-xs bg-green-500/10 border-green-500/20 hover:bg-green-500/20">
                                                        Approve
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="h-7 text-xs bg-red-500/10 border-red-500/20 hover:bg-red-500/20">
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                            {withdrawal.status === "APPROVED" && (
                                                <Button size="sm" variant="outline" className="h-7 text-xs bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20">
                                                    Mark as Sent
                                                </Button>
                                            )}
                                            {["COMPLETED", "REJECTED"].includes(withdrawal.status) && (
                                                <Button size="sm" variant="outline" className="h-7 text-xs" disabled>
                                                    {withdrawal.status === "COMPLETED" ? "Sent" : "Rejected"}
                                                </Button>
                                            )}
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
