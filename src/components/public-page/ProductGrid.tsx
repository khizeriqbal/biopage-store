"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Star, ArrowRight, Bell, Loader2 } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect } from "react";
import { PurchaseModal } from "./PurchaseModal";
import { toast } from "sonner";

interface Review {
    rating: number;
}

interface Product {
    id: string;
    title: string;
    type: string;
    price: number;
    priceType?: string;
    minPrice?: number | null;
    comparePrice?: number | null;
    coverImage?: string | null;
    description?: string | null;
    featured: boolean;
    slug: string;
    waitlisted?: boolean;
    reviews?: Review[];
    sellerId?: string;
}

interface ProductGridProps {
    products: Product[];
    settings: {
        primaryColor: string;
        accentColor: string;
    };
}

const typeLabels: Record<string, string> = {
    DIGITAL: "Download",
    COURSE: "Course",
    BOOKING: "Booking",
    MEMBERSHIP: "Join",
    LEAD_MAGNET: "Free",
};

function StarRating({ rating, count }: { rating: number; count: number }) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`h-3 w-3 ${s <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"}`} />
            ))}
            <span className="text-[10px] text-muted-foreground ml-1">({count})</span>
        </div>
    );
}

function WaitlistForm({ productId, primaryColor }: { productId: string; primaryColor: string }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [joined, setJoined] = useState(false);

    const handleJoin = async () => {
        if (!email) return;
        setLoading(true);
        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, email }),
            });
            if (res.ok) {
                setJoined(true);
                toast.success("You're on the waitlist!");
            } else {
                const d = await res.json();
                toast.error(d.error || "Failed to join waitlist");
            }
        } finally {
            setLoading(false);
        }
    };

    if (joined) {
        return (
            <div className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 font-bold text-sm">
                <Star className="h-4 w-4 fill-current" /> You're on the list!
            </div>
        );
    }

    return (
        <div className="flex gap-2">
            <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-surface-raised border-border h-11 text-sm flex-1"
            />
            <Button
                onClick={handleJoin}
                disabled={loading || !email}
                className="h-11 shrink-0 font-bold"
                style={{ backgroundColor: primaryColor }}
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
            </Button>
        </div>
    );
}

export function ProductGrid({ products, settings }: ProductGridProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [affiliateCode, setAffiliateCode] = useState<string>("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get("ref");
        if (ref) setAffiliateCode(ref);
    }, []);

    return (
        <div className="w-full space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                {products.map((product) => {
                    const reviews = product.reviews || [];
                    const avgRating = reviews.length > 0
                        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
                        : 0;
                    const isPWYW = product.priceType === "MINIMUM" || product.priceType === "FREE";

                    return (
                        <Card
                            key={product.id}
                            className={cn(
                                "group border-border bg-surface-raised/40 backdrop-blur-md overflow-hidden transition-all hover:bg-surface-hover/60 hover:border-brand/30",
                                product.featured && "border-brand/40 ring-1 ring-brand/20 shadow-xl shadow-brand/10"
                            )}
                        >
                            <div className="relative aspect-video w-full overflow-hidden bg-surface">
                                {product.coverImage ? (
                                    <Image
                                        src={product.coverImage}
                                        alt={product.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div
                                        className="h-full w-full flex items-center justify-center opacity-40 bg-gradient-to-br"
                                        style={{ backgroundImage: `linear-gradient(135deg, ${settings.primaryColor}22, ${settings.accentColor}22)` }}
                                    >
                                        <ShoppingBag className="h-10 w-10 text-brand/20" />
                                    </div>
                                )}
                                {product.featured && (
                                    <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground border-none font-black text-[10px] py-0 px-2 h-5 flex items-center gap-1 uppercase tracking-widest leading-none">
                                        <Star className="h-3 w-3 fill-current" /> Featured
                                    </Badge>
                                )}
                                <Badge className="absolute top-2 left-2 bg-brand text-white border-none font-bold uppercase text-[9px] py-0 px-2 h-5 tracking-widest leading-none">
                                    {typeLabels[product.type] || product.type}
                                </Badge>
                                {product.waitlisted && (
                                    <div className="absolute inset-0 bg-dark-bg/60 flex items-center justify-center">
                                        <Badge className="bg-yellow-500/90 text-black border-none font-black text-xs px-3 py-1 flex items-center gap-1">
                                            <Bell className="h-3 w-3" /> Coming Soon
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            <CardHeader className="p-5 pb-2">
                                <h3 className="text-xl font-bold text-white group-hover:text-brand transition-colors tracking-tight line-clamp-1">
                                    {product.title}
                                </h3>
                                {product.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                        {product.description}
                                    </p>
                                )}
                                {avgRating > 0 && (
                                    <StarRating rating={avgRating} count={reviews.length} />
                                )}
                            </CardHeader>

                            <CardContent className="p-5 pt-0 space-y-4">
                                <div className="flex items-baseline gap-2">
                                    {isPWYW ? (
                                        <span className="text-xl font-black text-accent">
                                            {product.priceType === "FREE" ? "Pay What You Want" : `From ${formatPrice(product.minPrice || product.price)}`}
                                        </span>
                                    ) : (
                                        <>
                                            <span className="text-2xl font-black text-accent">{formatPrice(product.price)}</span>
                                            {product.comparePrice && product.comparePrice > product.price && (
                                                <span className="text-sm text-muted-foreground line-through opacity-70">
                                                    {formatPrice(product.comparePrice)}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="p-5 pt-0">
                                {product.waitlisted ? (
                                    <div className="w-full space-y-2">
                                        <p className="text-xs text-muted-foreground font-medium">Join the waitlist — be first to know when this drops</p>
                                        <WaitlistForm productId={product.id} primaryColor={settings.primaryColor} />
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => setSelectedProduct(product)}
                                        className="w-full flex items-center justify-between group/btn gap-2 h-12 rounded-xl transition-all shadow-lg active:scale-95"
                                        style={{ backgroundColor: settings.primaryColor, color: "white" }}
                                    >
                                        <span className="font-bold tracking-wide uppercase text-xs">
                                            {product.type === "BOOKING" ? "Book a Session"
                                                : product.type === "COURSE" ? "Enroll Now"
                                                : isPWYW ? "Support This"
                                                : product.price === 0 ? "Get it Free"
                                                : "Purchase Now"}
                                        </span>
                                        <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {selectedProduct && (
                <PurchaseModal
                    product={selectedProduct as any}
                    open={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    settings={settings}
                    affiliateCode={affiliateCode}
                />
            )}
        </div>
    );
}
