import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap, Copy, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "DFY Templates Vault — 50+ Ready-Made Sales Pages | bio page.store",
    description: "50+ done-for-you sales page templates, email sequences, and landing pages. Copy-paste and customize. Only $27 one-time.",
};

export default function Oto2Page() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] text-white selection:bg-brand selection:text-white overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-brand/20 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative z-10 bg-surface-raised/50 border-b border-border/50 backdrop-blur-sm sticky top-0">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="text-xl font-black text-brand">bio page.store</div>
                    <div className="text-sm font-bold text-muted-foreground">OTO 2 of 4</div>
                </div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-12">
                <div className="rounded-xl border border-accent/50 bg-accent/10 p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-white text-sm mb-1">Special Bonus Offer (OTO 2 of 4)</p>
                        <p className="text-xs text-muted-foreground">This bonus package is 80% off. You won't get this price again!</p>
                    </div>
                </div>

                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10">
                        <Copy className="h-4 w-4 text-accent" />
                        <span className="text-sm font-bold text-accent">DFY TEMPLATES</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-black leading-[1.1] tracking-tight">
                        50+ Done-For-You <br />
                        <span className="bg-gradient-to-r from-accent to-brand bg-clip-text text-transparent">
                            Sales Templates
                        </span>
                    </h1>

                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        Ready-made sales pages, email sequences, and funnel templates. Just copy, customize, and launch. Save 100+ hours.
                    </p>

                    <div className="bg-gradient-to-r from-accent/20 to-brand/20 rounded-xl border border-accent/30 p-6 text-center">
                        <p className="text-muted-foreground text-sm mb-2">FLASH SALE</p>
                        <div className="text-5xl font-black text-accent mb-2">$27<span className="text-lg text-muted-foreground">/one-time</span></div>
                        <p className="text-sm text-muted-foreground">Usually $127 (Save $100!)</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-black">What You Get</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            "15 high-converting sales page templates",
                            "20 email sequence templates (follow-ups, upsells, etc)",
                            "10 landing page templates",
                            "5 pre-written funnel blueprints",
                            "Copywriting swipes library (200+ formulas)",
                            "Video tutorials (how to customize each template)",
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                                <span className="text-white/80">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-8 backdrop-blur-sm space-y-4">
                    <h3 className="text-lg font-bold">Perfect Templates for...</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            "📕 Courses & Training",
                            "🎯 Coaching Services",
                            "🎨 Digital Design Products",
                            "📸 Preset Packs",
                            "📝 Templates & Guides",
                            "🎓 Certifications",
                            "🔧 Software/Tools",
                            "💪 Fitness Programs",
                        ].map((item) => (
                            <div key={item} className="text-sm text-white/80">{item}</div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-8 backdrop-blur-sm">
                    <p className="text-lg text-white/90 mb-4 italic">
                        "These templates saved me SO much time. I launched 3 products in one week using these. Worth every penny."
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-brand to-accent" />
                        <div>
                            <p className="font-bold text-white">James P.</p>
                            <p className="text-xs text-muted-foreground">Launched 3 products using templates</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 text-center">
                    <div className="bg-gradient-to-r from-accent/20 to-brand/20 rounded-2xl border border-accent/30 p-8">
                        <h3 className="text-2xl font-black mb-2">Save 100+ Hours</h3>
                        <p className="text-muted-foreground mb-6">Stop creating from scratch. Use proven templates instead.</p>
                        <Button size="lg" className="bg-accent text-black hover:bg-accent/90 font-black rounded-xl h-14 px-8 text-base shadow-lg shadow-accent/25 w-full">
                            Add Templates Now <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <p className="text-xs text-muted-foreground/60 mt-4">One-time payment · Lifetime access · Free updates</p>
                    </div>

                    <Button variant="outline" className="w-full rounded-lg h-11 font-bold">
                        Skip This Offer, Continue to Next
                    </Button>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold">Questions?</h3>
                    {[
                        { q: "Can I customize the templates?", a: "Yes! All templates are fully customizable in our editor. Change colors, text, images, everything." },
                        { q: "Do you update these templates?", a: "Yes, we add 10+ new templates every month. You get all future updates free." },
                        { q: "What format are they in?", a: "They work in bio page.store. Just select a template and customize it in the builder." },
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
