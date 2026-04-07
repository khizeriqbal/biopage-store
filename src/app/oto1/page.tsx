import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap, TrendingUp, Users, Lock, Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Creator Pro Upgrade — Advanced Analytics & Automation | bio page.store",
    description: "Unlock advanced features: real-time analytics, advanced email automation, priority support, and more. Only $37 one-time.",
};

export default function Oto1Page() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] text-white selection:bg-brand selection:text-white overflow-hidden">
            {/* Animated background blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-brand/20 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[150px] pointer-events-none" />

            {/* Top Bar */}
            <div className="relative z-10 bg-surface-raised/50 border-b border-border/50 backdrop-blur-sm sticky top-0">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="text-xl font-black text-brand">bio page.store</div>
                    <div className="text-sm font-bold text-muted-foreground">Limited Time Offer</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-12">
                {/* Alert Banner */}
                <div className="rounded-xl border border-accent/50 bg-accent/10 p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-white text-sm mb-1">One-Time Offer (OTO 1 of 4)</p>
                        <p className="text-xs text-muted-foreground">This special offer is only available right now during checkout. You won't see this again!</p>
                    </div>
                </div>

                {/* Hero */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10">
                        <Zap className="h-4 w-4 text-accent" />
                        <span className="text-sm font-bold text-accent">PRO FEATURES UNLOCK</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-black leading-[1.1] tracking-tight">
                        Upgrade to <br />
                        <span className="bg-gradient-to-r from-accent to-brand bg-clip-text text-transparent">
                            Creator Pro
                        </span>
                    </h1>

                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        Unlock advanced analytics, automation, and priority support. Everything you need to scale to 6 figures.
                    </p>

                    <div className="bg-gradient-to-r from-accent/20 to-brand/20 rounded-xl border border-accent/30 p-6 text-center">
                        <p className="text-muted-foreground text-sm mb-2">SPECIAL OFFER TODAY</p>
                        <div className="text-5xl font-black text-accent mb-2">$37<span className="text-lg text-muted-foreground">/one-time</span></div>
                        <p className="text-sm text-muted-foreground">Usually $197 per year</p>
                    </div>
                </div>

                {/* Why This Matters */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-black">Why Creators Are Upgrading</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            "See exactly what's selling (real-time analytics)",
                            "Automate follow-ups with advanced email rules",
                            "Track affiliate revenue by source",
                            "Get priority email support (2-hour response)",
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <TrendingUp className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                                <span className="text-white/80">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Feature Comparison */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border/50">
                                <th className="text-left py-3 px-4 font-bold">Feature</th>
                                <th className="text-center py-3 px-4 font-bold">Standard</th>
                                <th className="text-center py-3 px-4 font-bold text-accent">Creator Pro</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { feature: "Basic Analytics", std: true, pro: true },
                                { feature: "Real-Time Dashboard", std: false, pro: true },
                                { feature: "Advanced Email Rules", std: false, pro: true },
                                { feature: "Custom Report Builder", std: false, pro: true },
                                { feature: "Affiliate Revenue Tracking", std: false, pro: true },
                                { feature: "Priority Support", std: false, pro: true },
                                { feature: "API Access", std: false, pro: true },
                            ].map((row, idx) => (
                                <tr key={idx} className="border-b border-border/30">
                                    <td className="py-3 px-4 text-white">{row.feature}</td>
                                    <td className="py-3 px-4 text-center">
                                        {row.std ? <CheckCircle2 className="h-5 w-5 text-green-400 mx-auto" /> : <span className="text-muted-foreground">—</span>}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        {row.pro ? <CheckCircle2 className="h-5 w-5 text-accent mx-auto" /> : <span className="text-muted-foreground">—</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Testimonial */}
                <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-8 backdrop-blur-sm">
                    <p className="text-lg text-white/90 mb-4 italic">
                        "The real-time analytics alone is worth it. I can see which products are converting and optimize in hours instead of days. Made an extra $8K last month just by tracking what works."
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-brand to-accent" />
                        <div>
                            <p className="font-bold text-white">Sarah M.</p>
                            <p className="text-xs text-muted-foreground">Made $48K with Creator Pro</p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="space-y-4 text-center">
                    <div className="bg-gradient-to-r from-accent/20 to-brand/20 rounded-2xl border border-accent/30 p-8">
                        <h3 className="text-2xl font-black mb-2">Limited Time Offer</h3>
                        <p className="text-muted-foreground mb-6">Add Creator Pro to your order now for only $37</p>
                        <Button size="lg" className="bg-accent text-black hover:bg-accent/90 font-black rounded-xl h-14 px-8 text-base shadow-lg shadow-accent/25 w-full">
                            Add Creator Pro Now <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <p className="text-xs text-muted-foreground/60 mt-4">One-time payment · Lifetime access · 30-day guarantee</p>
                    </div>

                    <Button variant="outline" className="w-full rounded-lg h-11 font-bold">
                        Skip This Offer, Continue to Next
                    </Button>
                </div>

                {/* FAQ */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold">Quick Questions</h3>
                    {[
                        { q: "Is this a recurring charge?", a: "No! This is a one-time payment of $37. You own it forever." },
                        { q: "What if I don't like it?", a: "30-day money-back guarantee. If you're not happy, we'll refund you." },
                        { q: "Can I upgrade later?", a: "Yes, but the price increases to $197/year. Get it now while it's $37." },
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
