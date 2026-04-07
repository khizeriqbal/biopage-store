"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Star, CheckCircle2, XCircle, Trash2, MessageSquare } from "lucide-react";

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    buyerName: string | null;
    buyerEmail: string;
    approved: boolean;
    createdAt: string;
    product: { title: string };
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`h-3.5 w-3.5 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
            ))}
        </div>
    );
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

    const fetchReviews = async () => {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
    };

    useEffect(() => { fetchReviews(); }, []);

    const handleApprove = async (id: string, approved: boolean) => {
        await fetch("/api/reviews", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, approved }),
        });
        toast.success(approved ? "Review approved and published!" : "Review rejected");
        fetchReviews();
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
        toast.success("Review deleted");
        fetchReviews();
    };

    const filtered = reviews.filter(r => {
        if (filter === "pending") return !r.approved;
        if (filter === "approved") return r.approved;
        return true;
    });

    const avgRating = reviews.length > 0
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : "—";

    const pending = reviews.filter(r => !r.approved).length;

    return (
        <div className="space-y-8 pb-24 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        Reviews <MessageSquare className="h-6 w-6 text-muted-foreground" />
                    </h1>
                    <p className="text-muted-foreground mt-1">Approve and manage customer reviews on your products.</p>
                </div>
                {pending > 0 && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-none font-bold text-sm px-3 py-1">
                        {pending} pending review{pending > 1 ? "s" : ""}
                    </Badge>
                )}
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Avg Rating", value: avgRating, sub: `${reviews.length} total` },
                    { label: "Approved", value: reviews.filter(r => r.approved).length, sub: "visible to buyers" },
                    { label: "Pending", value: pending, sub: "awaiting approval" },
                ].map(stat => (
                    <div key={stat.label} className="p-5 rounded-2xl border border-border bg-surface-raised/40 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                        <div className="text-2xl font-black text-white">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.sub}</div>
                    </div>
                ))}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2">
                {(["all", "pending", "approved"] as const).map(f => (
                    <Button
                        key={f}
                        variant={filter === f ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter(f)}
                        className={filter === f ? "bg-brand text-white border-none" : "border-border text-muted-foreground"}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </Button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-24 rounded-3xl border border-dashed border-border">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground font-medium">No reviews {filter !== "all" ? `in "${filter}"` : "yet"}</p>
                    <p className="text-sm text-muted-foreground/60 mt-1">Reviews appear here after customers make purchases</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filtered.map((review) => (
                        <div key={review.id} className={`p-5 rounded-2xl border bg-surface-raised/40 space-y-3 ${review.approved ? "border-green-500/20" : "border-border"}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <StarRating rating={review.rating} />
                                        <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">
                                            {review.product.title}
                                        </Badge>
                                        <Badge className={`text-[10px] border-none ${review.approved ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                                            {review.approved ? "Approved" : "Pending"}
                                        </Badge>
                                    </div>
                                    <p className="font-bold text-white">{review.buyerName || review.buyerEmail}</p>
                                    {review.comment && (
                                        <p className="text-sm text-muted-foreground leading-relaxed italic">"{review.comment}"</p>
                                    )}
                                    <p className="text-[10px] text-muted-foreground/60">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {!review.approved ? (
                                        <Button
                                            size="sm"
                                            onClick={() => handleApprove(review.id, true)}
                                            className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-none text-xs gap-1 h-8"
                                        >
                                            <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            onClick={() => handleApprove(review.id, false)}
                                            className="bg-muted text-muted-foreground hover:bg-surface-hover border-none text-xs gap-1 h-8"
                                        >
                                            <XCircle className="h-3.5 w-3.5" /> Unpublish
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(review.id)}
                                        className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10 h-8 w-8"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
