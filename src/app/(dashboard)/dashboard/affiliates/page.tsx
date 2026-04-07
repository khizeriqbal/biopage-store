"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Users, Plus, Trash2, Copy, TrendingUp, MousePointerClick } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface AffiliateLink {
    id: string;
    affiliateEmail: string;
    affiliateName: string | null;
    code: string;
    commissionPercent: number;
    totalEarned: number;
    totalClicks: number;
    approved: boolean;
    createdAt: string;
    _count: { orders: number; earnings: number };
}

export default function AffiliatesPage() {
    const [affiliates, setAffiliates] = useState<AffiliateLink[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ affiliateEmail: "", affiliateName: "", commissionPercent: "30" });
    const appUrl = typeof window !== "undefined" ? window.location.origin : "";

    const fetchAffiliates = async () => {
        const res = await fetch("/api/affiliates");
        const data = await res.json();
        setAffiliates(Array.isArray(data) ? data : []);
    };

    useEffect(() => { fetchAffiliates(); }, []);

    const handleCreate = async () => {
        if (!form.affiliateEmail) {
            toast.error("Affiliate email is required");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/affiliates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Affiliate link created!");
                setOpen(false);
                setForm({ affiliateEmail: "", affiliateName: "", commissionPercent: "30" });
                fetchAffiliates();
            } else {
                const d = await res.json();
                toast.error(d.error || "Failed to create affiliate");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/affiliates?id=${id}`, { method: "DELETE" });
        toast.success("Affiliate removed");
        fetchAffiliates();
    };

    const copyLink = (code: string) => {
        const username = window.location.pathname.split("/")[1];
        navigator.clipboard.writeText(`${appUrl}/[username]?ref=${code}`);
        toast.success("Affiliate link copied!");
    };

    const totalEarned = affiliates.reduce((s, a) => s + a.totalEarned, 0);
    const totalClicks = affiliates.reduce((s, a) => s + a.totalClicks, 0);
    const totalOrders = affiliates.reduce((s, a) => s + a._count.orders, 0);

    return (
        <div className="space-y-8 pb-24 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        Affiliates <Users className="h-6 w-6 text-muted-foreground" />
                    </h1>
                    <p className="text-muted-foreground mt-1">Invite affiliates to promote your products for a commission.</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-brand text-white hover:bg-brand/90 font-bold gap-2">
                            <Plus className="h-4 w-4" /> Add Affiliate
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-dark-bg border-border max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-white">Create Affiliate Link</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Affiliate Email</Label>
                                <Input
                                    type="email"
                                    value={form.affiliateEmail}
                                    onChange={e => setForm(f => ({ ...f, affiliateEmail: e.target.value }))}
                                    placeholder="affiliate@example.com"
                                    className="bg-surface-raised border-border text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Affiliate Name (optional)</Label>
                                <Input
                                    value={form.affiliateName}
                                    onChange={e => setForm(f => ({ ...f, affiliateName: e.target.value }))}
                                    placeholder="John Doe"
                                    className="bg-surface-raised border-border text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Commission (%)</Label>
                                <Input
                                    type="number"
                                    value={form.commissionPercent}
                                    onChange={e => setForm(f => ({ ...f, commissionPercent: e.target.value }))}
                                    min="1" max="100"
                                    className="bg-surface-raised border-border text-white"
                                />
                            </div>
                            <Button onClick={handleCreate} disabled={loading} className="w-full bg-brand text-white hover:bg-brand/90 font-bold">
                                {loading ? "Creating..." : "Create Affiliate Link"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Earned", value: formatPrice(totalEarned), icon: TrendingUp, color: "text-accent" },
                    { label: "Total Clicks", value: totalClicks.toLocaleString(), icon: MousePointerClick, color: "text-brand" },
                    { label: "Referred Orders", value: totalOrders.toLocaleString(), icon: Users, color: "text-blue-400" },
                ].map(stat => (
                    <div key={stat.label} className="p-5 rounded-2xl border border-border bg-surface-raised/40 space-y-2">
                        <div className="flex items-center gap-2">
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                        </div>
                        <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                    </div>
                ))}
            </div>

            {affiliates.length === 0 ? (
                <div className="text-center py-24 rounded-3xl border border-dashed border-border">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground font-medium">No affiliates yet</p>
                    <p className="text-sm text-muted-foreground/60 mt-1">Add affiliates to grow your sales virally</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {affiliates.map((affiliate) => (
                        <div key={affiliate.id} className="p-5 rounded-2xl border border-border bg-surface-raised/40 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-black text-lg">
                                    {(affiliate.affiliateName || affiliate.affiliateEmail)[0].toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white">{affiliate.affiliateName || affiliate.affiliateEmail}</span>
                                        <Badge className="bg-accent/20 text-accent border-none text-[10px]">{affiliate.commissionPercent}% commission</Badge>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                        <code className="font-mono text-brand">{affiliate.code}</code>
                                        <span>{affiliate.totalClicks} clicks</span>
                                        <span>{affiliate._count.orders} orders</span>
                                        <span className="font-bold text-accent">{formatPrice(affiliate.totalEarned)} earned</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyLink(affiliate.code)}
                                    className="border-border text-muted-foreground hover:text-white text-xs gap-1"
                                >
                                    <Copy className="h-3 w-3" /> Copy Link
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(affiliate.id)}
                                    className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10 h-8 w-8"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
