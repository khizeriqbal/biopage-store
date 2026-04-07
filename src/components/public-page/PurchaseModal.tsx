"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ShoppingBag,
    ArrowRight,
    Lock,
    ChevronRight,
    Mail,
    User,
    Loader2,
    Tag,
    CheckCircle2,
    Minus,
    Plus
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { formatPrice, cn } from "@/lib/utils";
import { toast } from "sonner";

interface PurchaseModalProps {
    product: {
        id: string;
        title: string;
        price: number;
        priceType?: string;
        minPrice?: number | null;
        description: string | null;
        coverImage: string | null;
        sellerId?: string;
    };
    open: boolean;
    onClose: () => void;
    settings: {
        primaryColor: string;
        accentColor: string;
    };
    affiliateCode?: string;
}

export function PurchaseModal({ product, open, onClose, settings, affiliateCode }: PurchaseModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "" });
    const [couponCode, setCouponCode] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponApplied, setCouponApplied] = useState<{
        couponId: string;
        discountType: string;
        discountValue: number;
    } | null>(null);
    const [customAmount, setCustomAmount] = useState(product.price);

    const isPWYW = product.priceType === "MINIMUM" || product.priceType === "FREE";
    const minPrice = product.minPrice || (product.priceType === "FREE" ? 0 : product.price);

    const basePrice = isPWYW ? customAmount : product.price;
    const discountAmount = couponApplied
        ? couponApplied.discountType === "PERCENT"
            ? basePrice * (couponApplied.discountValue / 100)
            : Math.min(couponApplied.discountValue, basePrice)
        : 0;
    const finalPrice = Math.max(0, basePrice - discountAmount);

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        try {
            const res = await fetch("/api/coupons/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: couponCode, productId: product.id, sellerId: product.sellerId }),
            });
            const data = await res.json();
            if (res.ok && data.valid) {
                setCouponApplied(data);
                toast.success("Coupon applied!");
            } else {
                toast.error(data.error || "Invalid coupon");
            }
        } finally {
            setCouponLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.email) {
            toast.error("Email is required");
            return;
        }
        setLoading(true);
        try {
            if (finalPrice === 0) {
                const res = await fetch("/api/subscribers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...formData, productId: product.id }),
                });
                if (res.ok) {
                    toast.success("Check your email for access! 📥");
                    onClose();
                } else {
                    toast.error("An error occurred");
                }
            } else {
                const res = await fetch("/api/whop/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        productId: product.id,
                        buyerEmail: formData.email,
                        buyerName: formData.name,
                        couponCode: couponApplied ? couponCode : undefined,
                        customAmount: isPWYW ? customAmount : undefined,
                        affiliateCode,
                    }),
                });
                const data = await res.json();
                if (data.url) {
                    window.location.href = data.url;
                } else if (data.free && data.orderId) {
                    window.location.href = `/access/${data.orderId}`;
                } else {
                    toast.error(data.error || "Failed to start checkout");
                }
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md border-border bg-dark-bg p-0 gap-0 overflow-hidden shadow-2xl">
                <div className="h-full flex flex-col">
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="h-44 relative overflow-hidden bg-surface">
                                {product.coverImage ? (
                                    <Image src={product.coverImage} alt={product.title} fill className="object-cover" />
                                ) : (
                                    <div
                                        className="h-full w-full flex items-center justify-center bg-gradient-to-br"
                                        style={{ backgroundImage: `linear-gradient(135deg, ${settings.primaryColor}22, ${settings.accentColor}22)` }}
                                    >
                                        <ShoppingBag className="h-10 w-10 text-brand/20" />
                                    </div>
                                )}
                                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-dark-bg to-transparent" />
                            </div>

                            <div className="p-6 pt-3 space-y-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight">{product.title}</h3>
                                    {product.description && (
                                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mt-1">{product.description}</p>
                                    )}
                                </div>

                                {/* Pay What You Want slider */}
                                {isPWYW && (
                                    <div className="space-y-3 p-4 rounded-xl bg-surface-raised/40 border border-border">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                            {product.priceType === "FREE" ? "Pay What You Want" : `Name Your Price (min ${formatPrice(minPrice)})`}
                                        </Label>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 border-border"
                                                onClick={() => setCustomAmount(a => Math.max(minPrice, a - 1))}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <div className="flex-1 text-center">
                                                <span className="text-3xl font-black text-accent">{formatPrice(customAmount)}</span>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 border-border"
                                                onClick={() => setCustomAmount(a => a + 1)}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <input
                                            type="range"
                                            min={minPrice}
                                            max={Math.max(minPrice * 5, 100)}
                                            value={customAmount}
                                            onChange={e => setCustomAmount(parseFloat(e.target.value))}
                                            className="w-full accent-brand"
                                        />
                                    </div>
                                )}

                                {/* Price display */}
                                {!isPWYW && (
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-surface-raised/40 border border-border">
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Price</span>
                                        <div className="flex items-center gap-2">
                                            {couponApplied && discountAmount > 0 && (
                                                <span className="text-sm text-muted-foreground line-through">{formatPrice(basePrice)}</span>
                                            )}
                                            <span className="text-3xl font-black text-accent">{formatPrice(finalPrice)}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Coupon input */}
                                {finalPrice > 0 && !isPWYW && (
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/40" />
                                            <Input
                                                value={couponCode}
                                                onChange={e => {
                                                    setCouponCode(e.target.value.toUpperCase());
                                                    setCouponApplied(null);
                                                }}
                                                placeholder="COUPON CODE"
                                                className="bg-surface-raised border-border h-10 pl-9 font-mono text-sm text-white"
                                                disabled={!!couponApplied}
                                            />
                                        </div>
                                        {couponApplied ? (
                                            <div className="flex items-center gap-1 text-green-400 text-sm font-bold px-2">
                                                <CheckCircle2 className="h-4 w-4" /> Applied
                                            </div>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={applyCoupon}
                                                disabled={couponLoading || !couponCode}
                                                className="border-border text-muted-foreground hover:text-white h-10"
                                            >
                                                {couponLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Apply"}
                                            </Button>
                                        )}
                                    </div>
                                )}

                                <Button
                                    onClick={() => setStep(2)}
                                    className="w-full h-12 rounded-xl font-bold uppercase tracking-wider shadow-lg active:scale-95"
                                    style={{ backgroundColor: settings.primaryColor }}
                                >
                                    Continue <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                                <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1.5 opacity-60">
                                    <Lock className="h-3 w-3" /> Secure checkout powered by Whop
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="mb-6 space-y-2">
                                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
                                    <User className="h-6 w-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-white tracking-tight">Your details</h3>
                                <p className="text-sm text-muted-foreground">We'll send your access here.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Your Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/30" />
                                        <Input
                                            value={formData.name}
                                            onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                                            placeholder="John Doe"
                                            className="bg-surface-raised border-border h-11 pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Address *</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/30" />
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                                            placeholder="john@example.com"
                                            className="bg-surface-raised border-border h-11 pl-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Price summary */}
                            <div className="mt-4 p-3 rounded-xl bg-surface-raised/40 border border-border flex items-center justify-between">
                                <span className="text-xs text-muted-foreground font-medium">{product.title}</span>
                                <span className="font-black text-accent">{formatPrice(finalPrice)}</span>
                            </div>

                            <div className="pt-6 flex flex-col gap-3">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={loading || !formData.email}
                                    className="w-full h-12 rounded-xl font-bold uppercase tracking-wider shadow-lg active:scale-95"
                                    style={{ backgroundColor: settings.primaryColor }}
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                                    {finalPrice === 0 ? "Claim Free Access" : `Pay ${formatPrice(finalPrice)}`}
                                </Button>
                                <Button variant="ghost" onClick={() => setStep(1)} className="text-muted-foreground hover:bg-surface-hover/20">
                                    Go back
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
