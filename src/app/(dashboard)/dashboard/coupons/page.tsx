"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { Tag, Plus, Trash2, Copy, CheckCircle2, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Coupon {
    id: string;
    code: string;
    discountType: "PERCENT" | "FIXED";
    discountValue: number;
    maxUses: number | null;
    usedCount: number;
    expiresAt: string | null;
    active: boolean;
    createdAt: string;
    _count: { orders: number };
}

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        code: "",
        discountType: "PERCENT",
        discountValue: "",
        maxUses: "",
        expiresAt: "",
    });

    const fetchCoupons = async () => {
        const res = await fetch("/api/coupons");
        const data = await res.json();
        setCoupons(Array.isArray(data) ? data : []);
    };

    useEffect(() => { fetchCoupons(); }, []);

    const generateCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const code = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
        setForm(f => ({ ...f, code }));
    };

    const handleCreate = async () => {
        if (!form.code || !form.discountValue) {
            toast.error("Code and discount value are required");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/coupons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Coupon created!");
                setOpen(false);
                setForm({ code: "", discountType: "PERCENT", discountValue: "", maxUses: "", expiresAt: "" });
                fetchCoupons();
            } else {
                const d = await res.json();
                toast.error(d.error || "Failed to create coupon");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/coupons?id=${id}`, { method: "DELETE" });
        toast.success("Coupon deleted");
        fetchCoupons();
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success("Copied to clipboard!");
    };

    return (
        <div className="space-y-8 pb-24 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        Coupons & Discounts <Tag className="h-6 w-6 text-muted-foreground" />
                    </h1>
                    <p className="text-muted-foreground mt-1">Create discount codes for your products and promotions.</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-brand text-white hover:bg-brand/90 font-bold gap-2">
                            <Plus className="h-4 w-4" /> Create Coupon
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-dark-bg border-border max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-white">Create Discount Coupon</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Coupon Code</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={form.code}
                                        onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                                        placeholder="SUMMER50"
                                        className="bg-surface-raised border-border text-white font-mono font-bold"
                                    />
                                    <Button variant="outline" size="sm" onClick={generateCode} className="border-border shrink-0">
                                        Generate
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type</Label>
                                    <Select value={form.discountType} onValueChange={v => setForm(f => ({ ...f, discountType: v }))}>
                                        <SelectTrigger className="bg-surface-raised border-border text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PERCENT">Percentage (%)</SelectItem>
                                            <SelectItem value="FIXED">Fixed Amount ($)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        {form.discountType === "PERCENT" ? "Percentage Off" : "Amount Off ($)"}
                                    </Label>
                                    <Input
                                        type="number"
                                        value={form.discountValue}
                                        onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))}
                                        placeholder={form.discountType === "PERCENT" ? "20" : "10"}
                                        className="bg-surface-raised border-border text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Max Uses (optional)</Label>
                                    <Input
                                        type="number"
                                        value={form.maxUses}
                                        onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))}
                                        placeholder="100"
                                        className="bg-surface-raised border-border text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Expires At (optional)</Label>
                                    <Input
                                        type="date"
                                        value={form.expiresAt}
                                        onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                                        className="bg-surface-raised border-border text-white"
                                    />
                                </div>
                            </div>

                            <Button onClick={handleCreate} disabled={loading} className="w-full bg-brand text-white hover:bg-brand/90 font-bold">
                                {loading ? "Creating..." : "Create Coupon"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {coupons.length === 0 ? (
                <div className="text-center py-24 rounded-3xl border border-dashed border-border">
                    <Tag className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground font-medium">No coupons yet</p>
                    <p className="text-sm text-muted-foreground/60 mt-1">Create your first discount code to boost sales</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {coupons.map((coupon) => {
                        const isExpired = coupon.expiresAt && new Date() > new Date(coupon.expiresAt);
                        const isMaxed = coupon.maxUses && coupon.usedCount >= coupon.maxUses;
                        const isActive = coupon.active && !isExpired && !isMaxed;

                        return (
                            <div key={coupon.id} className="p-5 rounded-2xl border border-border bg-surface-raised/40 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                                        <Tag className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <code className="text-lg font-black text-white tracking-wider">{coupon.code}</code>
                                            <button onClick={() => copyCode(coupon.code)} className="text-muted-foreground hover:text-white transition-colors">
                                                <Copy className="h-3.5 w-3.5" />
                                            </button>
                                            <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-green-500/20 text-green-400 border-none text-[10px]" : "bg-muted text-muted-foreground border-none text-[10px]"}>
                                                {isActive ? "Active" : isExpired ? "Expired" : isMaxed ? "Maxed" : "Inactive"}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                            <span className="font-bold text-accent">
                                                {coupon.discountType === "PERCENT" ? `${coupon.discountValue}% off` : `$${coupon.discountValue} off`}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" /> {coupon.usedCount}{coupon.maxUses ? `/${coupon.maxUses}` : ""} used
                                            </span>
                                            {coupon.expiresAt && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" /> Expires {new Date(coupon.expiresAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(coupon.id)}
                                    className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10 h-8 w-8"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
