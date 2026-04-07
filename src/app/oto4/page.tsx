import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Crown, Zap, AlertCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Reseller Rights — Own The IP & Rebrand Everything | bio page.store",
    description: "Get complete reseller rights. Rebrand bio page.store as your own product. Sell the entire course. Only $197 one-time.",
};

export default function Oto4Page() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] text-white selection:bg-brand selection:text-white overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-yellow-500/20 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-500/20 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative z-10 bg-surface-raised/50 border-b border-border/50 backdrop-blur-sm sticky top-0">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="text-xl font-black text-brand">bio page.store</div>
                    <div className="text-sm font-bold text-yellow-400">🔥 FINAL OFFER</div>
                </div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-12">
                <div className="rounded-xl border border-yellow-500/50 bg-yellow-500/10 p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-white text-sm mb-1">🔥 Final Offer (OTO 4 of 4)</p>
                        <p className="text-xs text-muted-foreground">The ultimate package. This is the last offer in the funnel. Only 50 licenses available.</p>
                    </div>
                </div>

                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10">
                        <Crown className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-bold text-yellow-400">OWNERSHIP TIER</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-black leading-[1.1] tracking-tight">
                        Own The Entire <br />
                        <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                            Platform & IP
                        </span>
                    </h1>

                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        Get complete reseller rights. Rebrand as your own. Sell the full platform and all materials. Keep 100% of profit forever.
                    </p>

                    <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-xl border border-yellow-500/30 p-6 text-center">
                        <p className="text-muted-foreground text-sm mb-2">LAST CHANCE</p>
                        <div className="text-5xl font-black text-yellow-400 mb-2">$197</div>
                        <p className="text-sm text-muted-foreground">One-time · Lifetime reseller rights · Unlimited resales</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-black">What You Get</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            "Complete IP & source materials",
                            "Rebrand as your own product",
                            "Sell to unlimited customers",
                            "Private label rights",
                            "Video tutorials included",
                            "All marketing materials (30+ templates)",
                            "Customer support templates",
                            "100% of all profits forever",
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                                <span className="text-white/80">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-8 backdrop-blur-sm">
                    <h3 className="text-lg font-bold mb-4">Income Potential</h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-white/80 mb-2">At Just 10 Customers Per Month:</p>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-border/30">
                                <span className="text-white/80">10 customers × $97 = <span className="font-bold">$970/mo</span></span>
                                <span className="text-yellow-400 text-sm font-bold">$11,640/year</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-white/80 mb-2">At 50 Customers Per Month:</p>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-border/30">
                                <span className="text-white/80">50 customers × $97 = <span className="font-bold">$4,850/mo</span></span>
                                <span className="text-yellow-400 text-sm font-bold">$58,200/year</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-8 backdrop-blur-sm">
                    <p className="text-lg text-white/90 mb-4 italic">
                        "I rebranded bio page.store and sold it for $197 each. In my first month, I made $35K in sales. This is absolutely insane. Thank you."
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500" />
                        <div>
                            <p className="font-bold text-white">David L.</p>
                            <p className="text-xs text-muted-foreground">Made $35K first month with reseller rights</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-6">
                    <h3 className="font-bold text-white mb-3">Here's What Makes This Unique:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-3">
                            <Zap className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
                            <span>You own the IP completely. Rebrand everything with your name.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Zap className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
                            <span>Sell for whatever price you want. $97, $197, $297... your choice.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Zap className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
                            <span>Unlimited customers. No limit to how many times you can sell it.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Zap className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
                            <span>One-time investment. No royalties, no recurring fees ever.</span>
                        </li>
                    </ul>
                </div>

                <div className="space-y-4 text-center">
                    <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl border border-yellow-500/30 p-8">
                        <h3 className="text-2xl font-black mb-2">Own Your Own Business</h3>
                        <p className="text-muted-foreground mb-6">With reseller rights, you're not dependent on any platform. You own everything.</p>
                        <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-600 font-black rounded-xl h-14 px-8 text-base shadow-lg shadow-yellow-500/25 w-full">
                            Claim Reseller Rights Now <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <p className="text-xs text-muted-foreground/60 mt-4">One-time payment · Lifetime rights · 100% profit</p>
                    </div>

                    <Button variant="outline" className="w-full rounded-lg h-11 font-bold">
                        Skip This, Complete Order
                    </Button>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold">Final Questions?</h3>
                    {[
                        { q: "Can I legally rebrand and resell this?", a: "Yes! You have complete reseller rights. You can change everything: name, branding, price, marketing, everything." },
                        { q: "What if someone else has already rebranded it?", a: "Everyone who gets reseller rights is using it under their own brand. You're not in competition with other resellers." },
                        { q: "What's the refund policy?", a: "30-day money-back guarantee. If you're not happy, we'll refund you every penny, no questions asked." },
                    ].map(({ q, a }, idx) => (
                        <div key={idx} className="rounded-lg border border-border/50 bg-surface-raised/30 p-4">
                            <p className="font-semibold text-white mb-1">{q}</p>
                            <p className="text-sm text-muted-foreground">{a}</p>
                        </div>
                    ))}
                </div>

                <div className="rounded-xl border border-brand/30 bg-brand/5 p-6 text-center">
                    <p className="font-black text-white mb-2">You're At The Final Step</p>
                    <p className="text-muted-foreground text-sm mb-4">
                        You've got the platform, templates, analytics, agency tools, AND now you can own the entire IP. This is the complete package.
                    </p>
                    <p className="text-xs text-yellow-400 font-semibold">
                        After this, we're done. Complete your order and you'll get everything.
                    </p>
                </div>
            </div>
        </div>
    );
}
