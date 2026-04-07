"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Star, ShieldCheck, Crown, Loader2, Award } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const plans = [
    {
        id: "FREE",
        name: "Free",
        price: "$0",
        desc: "For hobbyists and beginners.",
        features: ["Up to 3 products", "500 subscribers", "bio page.store domain", "Basic analytics"],
        icon: Zap,
        color: "bg-muted text-muted-foreground border-border",
    },
    {
        id: "STARTER",
        name: "Starter",
        price: "$9",
        period: "/mo",
        desc: "Perfect for growing creators.",
        features: ["Unlimited products", "5,000 subscribers", "Custom domain", "Advanced stats", "No bio page ads"],
        icon: Star,
        color: "bg-brand/10 text-brand border-brand/20 shadow-brand/10 shadow-lg",
        popular: true,
    },
    {
        id: "CREATOR",
        name: "Creator",
        price: "$29",
        period: "/mo",
        desc: "Scale your business with AI.",
        features: ["Everything in Starter", "Unlimited subscribers", "AI Marketing tools", "Email automation", "Priority support"],
        icon: Crown,
        color: "bg-accent/10 text-accent border-accent/20 shadow-accent/10 shadow-lg",
    },
];

export function PlanSelector({ currentPlan }: { currentPlan: string }) {
    const [loading, setLoading] = useState<string | null>(null);

    const handleUpgrade = async (plan: string) => {
        setLoading(plan);
        try {
            const res = await fetch("/api/whop/subscription", {
                method: "POST",
                body: JSON.stringify({ plan }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
                <div
                    key={plan.id}
                    className={cn(
                        "relative group rounded-3xl border p-8 flex flex-col items-center text-center transition-all bg-surface-raised/40 backdrop-blur-md overflow-hidden",
                        currentPlan === plan.id ? "border-brand ring-1 ring-brand/50 shadow-2xl" : "border-border hover:bg-surface-hover/60 hover:border-brand/30"
                    )}
                >
                    {plan.popular && (
                        <div className="absolute top-0 right-0 left-0 h-1 bg-brand" />
                    )}
                    {currentPlan === plan.id && (
                        <div className="absolute top-2 right-2">
                            <Badge className="bg-brand/20 text-brand border-brand/30 text-[9px] uppercase font-bold tracking-widest py-0 px-2 h-5 flex items-center gap-1 shadow-lg leading-none">
                                <Award className="h-3 w-3" /> Current Plan
                            </Badge>
                        </div>
                    )}

                    <div className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center mb-6 shadow-xl transition-all group-hover:scale-110",
                        plan.color
                    )}>
                        <plan.icon className="h-7 w-7" />
                    </div>

                    <div className="space-y-1 mb-8">
                        <h3 className="text-2xl font-black text-white tracking-tight">{plan.name}</h3>
                        <p className="text-xs text-muted-foreground font-medium">{plan.desc}</p>
                    </div>

                    <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-4xl font-black text-white">{plan.price}</span>
                        {plan.period && (
                            <span className="text-sm font-bold text-muted-foreground uppercase">{plan.period}</span>
                        )}
                    </div>

                    <div className="flex-1 w-full space-y-4 mb-8">
                        {plan.features.map((feature) => (
                            <div key={feature} className="flex items-center gap-3 text-xs font-semibold text-muted-foreground text-left leading-relaxed">
                                <div className={cn(
                                    "h-5 w-5 rounded-full flex items-center justify-center bg-accent/10 text-accent flex-shrink-0 shadow-lg",
                                    currentPlan === plan.id && "bg-brand/10 text-brand"
                                )}>
                                    <Check className="h-3 w-3" />
                                </div>
                                {feature}
                            </div>
                        ))}
                    </div>

                    <Button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={currentPlan === plan.id || loading === plan.id}
                        variant={currentPlan === plan.id ? "outline" : "default"}
                        className={cn(
                            "w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all text-white",
                            currentPlan === plan.id ? "border-border bg-transparent text-muted-foreground" : plan.id === "FREE" ? "bg-surface text-white hover:bg-surface-hover" : "bg-brand hover:bg-brand/90"
                        )}
                    >
                        {loading === plan.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : (currentPlan === plan.id ? "Already Active" : plan.id === "FREE" ? "Downgrade" : "Upgrade Now")}
                    </Button>
                </div>
            ))}
        </div>
    );
}
