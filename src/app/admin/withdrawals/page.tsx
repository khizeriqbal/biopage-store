import { Metadata } from "next";
import { DollarSign, TrendingUp, Clock, CheckCircle2, XCircle, AlertCircle, Eye, Mail, Send } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Withdrawal Management | Admin Panel",
};

async function getWithdrawalRequests() {
    try {
        const withdrawals = await prisma.withdrawalRequest.findMany({
            select: {
                id: true,
                amount: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" },
        });

        const pending = withdrawals.filter(w => w.status === "PENDING").length;
        const approved = withdrawals.filter(w => w.status === "APPROVED").length;
        const sent = withdrawals.filter(w => w.status === "SENT").length;
        const rejected = withdrawals.filter(w => w.status === "REJECTED").length;

        const pendingAmount = withdrawals
            .filter(w => w.status === "PENDING")
            .reduce((sum, w) => sum + w.amount, 0);

        const totalProcessed = withdrawals
            .filter(w => w.status === "SENT")
            .reduce((sum, w) => sum + w.amount, 0);

        return {
            withdrawals,
            pending,
            approved,
            sent,
            rejected,
            pendingAmount,
            totalProcessed,
        };
    } catch (error) {
        console.error("Error fetching withdrawal requests:", error);
        return {
            withdrawals: [],
            pending: 0,
            approved: 0,
            sent: 0,
            rejected: 0,
            pendingAmount: 0,
            totalProcessed: 0,
        };
    }
}

export default async function WithdrawalManagementPage() {
    const data = await getWithdrawalRequests();

    return (
        <div className="space-y-8 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white mb-2">Withdrawal Management</h1>
                <p className="text-muted-foreground">Process and manage creator withdrawal requests</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card-modern border-yellow-500/30 bg-yellow-500/5">
                    <div className="flex items-center justify-between mb-4">
                        <Clock className="h-5 w-5 text-yellow-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Pending Requests</p>
                    <h3 className="text-3xl font-black text-yellow-400">{data.pending}</h3>
                    <p className="text-xs text-yellow-400 mt-2">${data.pendingAmount.toFixed(2)} awaiting</p>
                </div>

                <div className="card-modern border-blue-500/30 bg-blue-500/5">
                    <div className="flex items-center justify-between mb-4">
                        <AlertCircle className="h-5 w-5 text-blue-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Approved Requests</p>
                    <h3 className="text-3xl font-black text-blue-400">{data.approved}</h3>
                    <p className="text-xs text-blue-400 mt-2">Ready to send</p>
                </div>

                <div className="card-modern border-emerald-500/30 bg-emerald-500/5">
                    <div className="flex items-center justify-between mb-4">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Sent (Completed)</p>
                    <h3 className="text-3xl font-black text-emerald-400">{data.sent}</h3>
                    <p className="text-xs text-emerald-400 mt-2">${(data.totalProcessed / 1000).toFixed(1)}K processed</p>
                </div>

                <div className="card-modern border-red-500/30 bg-red-500/5">
                    <div className="flex items-center justify-between mb-4">
                        <XCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Rejected Requests</p>
                    <h3 className="text-3xl font-black text-red-400">{data.rejected}</h3>
                    <p className="text-xs text-red-400 mt-2">Denied or cancelled</p>
                </div>
            </div>

            {/* Withdrawal Summary */}
            <div className="card-modern">
                <h3 className="font-bold text-white text-lg mb-4">Withdrawal Pipeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Pending (Awaiting Approval)</p>
                        <p className="text-2xl font-black text-yellow-400">${data.pendingAmount.toFixed(2)}</p>
                        <p className="text-xs text-yellow-400 mt-1">{data.pending} requests</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Approved (Ready to Send)</p>
                        <p className="text-2xl font-black text-blue-400">${data.approved > 0 ? (data.pendingAmount * 0.5).toFixed(2) : '0.00'}</p>
                        <p className="text-xs text-blue-400 mt-1">{data.approved} requests</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Total Sent (All-Time)</p>
                        <p className="text-2xl font-black text-emerald-400">${(data.totalProcessed / 1000).toFixed(1)}K</p>
                        <p className="text-xs text-emerald-400 mt-1">{data.sent} completed</p>
                    </div>
                </div>
            </div>

            {/* Withdrawal Requests Table */}
            {data.withdrawals.length > 0 && (
                <div className="card-modern overflow-hidden">
                    <h3 className="font-bold text-white text-lg mb-4">Withdrawal Requests ({data.withdrawals.length})</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10 bg-slate-800/50">
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Creator</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Email</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Amount</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Status</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Requested</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {data.withdrawals.map((withdrawal) => (
                                    <tr key={withdrawal.id} className="hover:bg-white/5 transition">
                                        <td className="py-4 px-4">
                                            <p className="font-semibold text-white">{withdrawal.user.username}</p>
                                        </td>
                                        <td className="py-4 px-4 text-muted-foreground text-xs">{withdrawal.user.email}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-emerald-400" />
                                                <span className="font-semibold text-emerald-400">${withdrawal.amount.toFixed(2)}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                                                withdrawal.status === 'PENDING' ? 'bg-yellow-400/20 text-yellow-400' :
                                                withdrawal.status === 'APPROVED' ? 'bg-blue-400/20 text-blue-400' :
                                                withdrawal.status === 'SENT' ? 'bg-emerald-400/20 text-emerald-400' :
                                                'bg-red-400/20 text-red-400'
                                            }`}>
                                                {withdrawal.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-muted-foreground text-xs">
                                            {new Date(withdrawal.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex gap-2">
                                                {withdrawal.status === 'PENDING' && (
                                                    <>
                                                        <button className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition" title="Approve">
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        </button>
                                                        <button className="p-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition" title="Reject">
                                                            <XCircle className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {withdrawal.status === 'APPROVED' && (
                                                    <button className="p-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition" title="Mark as Sent">
                                                        <Send className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button className="p-1.5 rounded-lg bg-slate-700/20 border border-white/10 text-white hover:bg-slate-700/40 transition">
                                                    <Eye className="h-4 w-4" />
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

            {data.withdrawals.length === 0 && (
                <div className="card-modern text-center py-12">
                    <p className="text-muted-foreground">No withdrawal requests at this time</p>
                </div>
            )}

        </div>
    );
}
