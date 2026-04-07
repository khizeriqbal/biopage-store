import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap, Users, AlertCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Agency License — Run Unlimited Client Stores | bio page.store",
    description: "Manage unlimited client accounts under your own brand. White-label and resell bio page.store. Only $67 one-time.",
};

export default function Oto3Page() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] text-white selection:bg-brand selection:text-white overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-brand/20 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative z-10 bg-surface-raised/50 border-b border-border/50 backdrop-blur-sm sticky top-0">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="text-xl font-black text-brand">bio page.store</div>
                    <div className="text-sm font-bold text-muted-foreground">OTO 3 of 4</div>
                </div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-12">
                <div className="rounded-xl border border-orange-500/50 bg-orange-500/10 p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-white text-sm mb-1">Advanced Offer (OTO 3 of 4)</p>
                        <p className="text-xs text-muted-foreground">This is the highest value offer. Limited to 100 licenses.</p>
                    </div>
                </div>

                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10">
                        <Users className="h-4 w-4 text-orange-400" />
                        <span className="text-sm font-bold text-orange-400">AGENCY POWER</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-black leading-[1.1] tracking-tight">
                        Turn This Into a <br />
                        <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                            Client-Generating Machine
                        </span>
                    </h1>

                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        Get your Agency License. White-label bio page.store and sell to unlimited clients. Keep 100% of profits.
                    </p>

                    <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/30 p-6 text-center">
                        <p className="text-muted-foreground text-sm mb-2">ONE-TIME INVESTMENT</p>
                        <div className="text-5xl font-black text-orange-400 mb-2">$67</div>
                        <p className="text-sm text-muted-foreground">Unlimited client accounts, lifetime</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-black">What's Included</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            "Unlimited client accounts",
                            "White-label dashboard",
                            "Custom branding (your logo, colors)",
                            "100% client profit retention",
                            "Reseller resources & training",
                            "Monthly affiliate commissions on client subscriptions",
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
                                <span className="text-white/80">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-8 backdrop-blur-sm">
                    <h3 className="text-lg font-bold mb-4">Earning Examples</h3>
                    <div className="space-y-3">
                        <div className="flex items-start justify-between p-3 rounded-lg bg-black/30 border border-border/30">
                            <span className="text-white/80">10 clients × $29/mo = <span className="font-bold">$290/mo</span></span>
                            <span className="text-orange-400 text-sm font-bold">$3,480/year</span>
                        </div>
                        <div className="flex items-start justify-between p-3 rounded-lg bg-black/30 border border-border/30">
                            <span className="text-white/80">50 clients × $79/mo = <span className="font-bold">$3,950/mo</span></span>
                            <span className="text-orange-400 text-sm font-bold">$47,400/year</span>
                        </div>
                        <div className="flex items-start justify-between p-3 rounded-lg bg-black/30 border border-border/30">
                            <span className="text-white/80">100 clients × $79/mo = <span className="font-bold">$7,900/mo</span></span>
                            <span className="text-orange-400 text-sm font-bold">$94,800/year</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-8 backdrop-blur-sm">
                    <p className="text-lg text-white/90 mb-4 italic">
                        "With the Agency License, I signed 23 clients in month 1. That's $18,000/month in recurring revenue. Best investment I made this year."
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 to-red-500" />
                        <div>
                            <p className="font-bold text-white">Michael T.</p>
                            <p className="text-xs text-muted-foreground">Agency owner, 23 clients</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 text-center">
                    <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl border border-orange-500/30 p-8">
                        <h3 className="text-2xl font-black mb-2">Scale Your Income</h3>
                        <p className="text-muted-foreground mb-6">Build a recurring revenue business in weeks, not months.</p>
                        <Button size="lg" className="bg-orange-500 text-white hover:bg-orange-600 font-black rounded-xl h-14 px-8 text-base shadow-lg shadow-orange-500/25 w-full">
                            Unlock Agency License <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <p className="text-xs text-muted-foreground/60 mt-4">One-time payment · Lifetime license · Unlimited clients</p>
                    </div>

                    <Button variant="outline" className="w-full rounded-lg h-11 font-bold">
                        Skip This Offer, Continue to Next
                    </Button>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold">Have Questions?</h3>
                    {[
                        { q: "Can I truly keep 100% of client payments?", a: "Yes! You set your pricing and keep all revenue. We only charge your clients our standard subscription fee that you mark up." },
                        { q: "Do I need technical skills?", a: "No. The platform is fully white-labeled. Your clients see your branding only." },
                        { q: "How do I get clients?", a: "We provide templates, sales pages, and training. Most agencies land clients through their existing network." },
                    ].map(({ q, a }, idx) => (
                        <div key={idx} className="rounded-lg border border-border/50 bg-surface-raised/30 p-4">
                            <p className="font-semibold text-white mb-1">{q}</p>
                            <p className="text-sm text-muted-foreground">{a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
