"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, User, Mail, MessageSquare, Users, Calendar, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface JvPartner {
    id: string;
    name: string;
    email: string;
    skype: string;
    listSize: string;
    createdAt: Date;
    approved: boolean;
}

interface JvPartnersTableProps {
    partners: JvPartner[];
}

export function JvPartnersTable({ partners }: JvPartnersTableProps) {
    const [approving, setApproving] = useState<string | null>(null);
    const [rejecting, setRejecting] = useState<string | null>(null);

    const handleApprove = async (partnerId: string) => {
        setApproving(partnerId);
        try {
            const res = await fetch("/api/admin/jv-partners/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ partnerId }),
            });

            if (!res.ok) throw new Error("Failed to approve");

            toast.success("JV Partner approved successfully!");
            setTimeout(() => window.location.reload(), 1000);
        } catch (error: any) {
            toast.error(error.message || "Failed to approve partner");
        } finally {
            setApproving(null);
        }
    };

    const handleReject = async (partnerId: string) => {
        if (!confirm("Are you sure you want to reject this application?")) return;

        setRejecting(partnerId);
        try {
            const res = await fetch("/api/admin/jv-partners/reject", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ partnerId }),
            });

            if (!res.ok) throw new Error("Failed to reject");

            toast.success("JV Partner application rejected");
            setTimeout(() => window.location.reload(), 1000);
        } catch (error: any) {
            toast.error(error.message || "Failed to reject partner");
        } finally {
            setRejecting(null);
        }
    };

    return (
        <div className="rounded-xl border border-border/50 bg-surface-raised/50 backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border/30 bg-black/30">
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Name
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Email
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Skype
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                List Size
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Applied
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
                        {partners.map((partner) => (
                            <tr key={partner.id} className="hover:bg-black/20 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                                        <span className="text-sm font-semibold text-white">{partner.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                                        <a href={`mailto:${partner.email}`} className="text-sm text-white hover:text-brand transition-colors">
                                            {partner.email}
                                        </a>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                                        <span className="text-sm text-white/80">{partner.skype}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                                        <span className="text-sm text-white/80">{partner.listSize}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-white/80 flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(partner.createdAt).toLocaleDateString()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {partner.approved ? (
                                        <div className="flex items-center gap-1 text-xs font-bold text-green-300">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Approved
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-xs font-bold text-yellow-300">
                                            ⏳ Pending
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 space-x-2">
                                    {!partner.approved && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="default"
                                                className="h-8 text-xs bg-green-600 hover:bg-green-700"
                                                onClick={() => handleApprove(partner.id)}
                                                disabled={approving === partner.id || rejecting === partner.id}
                                            >
                                                {approving === partner.id ? (
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                ) : (
                                                    "Approve"
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 text-xs text-red-400 border-red-500/50 hover:bg-red-500/10"
                                                onClick={() => handleReject(partner.id)}
                                                disabled={rejecting === partner.id || approving === partner.id}
                                            >
                                                {rejecting === partner.id ? (
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                ) : (
                                                    "Reject"
                                                )}
                                            </Button>
                                        </>
                                    )}
                                    {partner.approved && (
                                        <Button size="sm" variant="outline" className="h-8 text-xs">
                                            View Profile
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
