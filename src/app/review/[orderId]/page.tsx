"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
    params: { orderId: string };
}

export default function ReviewPage({ params }: Props) {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!rating) {
            toast.error("Please select a star rating");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/reviews/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: params.orderId, rating, comment }),
            });
            if (res.ok) {
                setSubmitted(true);
            } else {
                const d = await res.json();
                toast.error(d.error || "Failed to submit review");
            }
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 mx-auto">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-white">Thank you!</h1>
                        <p className="text-muted-foreground">Your review has been submitted and is pending approval.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
            <div className="max-w-md w-full space-y-8 animate-in fade-in duration-500">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-white">Leave a Review</h1>
                    <p className="text-muted-foreground">How was your experience with this product?</p>
                </div>

                <div className="p-8 rounded-3xl border border-border bg-surface-raised/40 space-y-6">
                    <div className="flex justify-center gap-3">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button
                                key={s}
                                onMouseEnter={() => setHovered(s)}
                                onMouseLeave={() => setHovered(0)}
                                onClick={() => setRating(s)}
                                className="transition-transform hover:scale-110 active:scale-95"
                            >
                                <Star
                                    className={`h-10 w-10 transition-colors ${
                                        s <= (hovered || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-muted-foreground/30"
                                    }`}
                                />
                            </button>
                        ))}
                    </div>

                    {rating > 0 && (
                        <p className="text-center text-sm font-bold text-muted-foreground">
                            {["", "Poor", "Fair", "Good", "Great", "Excellent!"][rating]}
                        </p>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Your Review (optional)</label>
                        <textarea
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder="Tell others what you think about this product..."
                            rows={4}
                            className="w-full bg-surface border border-border text-white text-sm rounded-xl p-4 resize-none focus:outline-none focus:ring-1 focus:ring-brand"
                        />
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={!rating || loading}
                        className="w-full h-12 bg-brand text-white hover:bg-brand/90 font-bold rounded-xl"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Submit Review
                    </Button>
                </div>
            </div>
        </div>
    );
}
