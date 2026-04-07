import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TrendingUp, Zap, Users, BarChart3, Lock, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "bio page.store — Creator Storefront (30-Day Free Trial)",
    description: "The all-in-one platform for creators. Sell digital products, run affiliate programs, and automate email sequences. 30-day free trial. No credit card required.",
};

export default function SalesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] text-white selection:bg-brand selection:text-white overflow-hidden">
            {/* Animated background blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-brand/20 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[150px] pointer-events-none" />

            {/* Top Bar */}
            <div className="relative z-10 bg-surface-raised/50 border-b border-border/50 backdrop-blur-sm sticky top-0">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="text-xl font-black text-brand">bio page.store</div>
                    <Link href="/login" className="text-sm font-bold hover:text-brand transition-colors">Sign In</Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-20 space-y-20">
                {/* Hero */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/30 bg-brand/10">
                        <Sparkles className="h-4 w-4 text-brand" />
                        <span className="text-sm font-bold text-brand">🚀 Launch Special</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl font-black leading-[1.1] tracking-tight">
                        Sell Digital Products <br />
                        <span className="bg-gradient-to-r from-brand via-purple-400 to-accent bg-clip-text text-transparent">
                            Without the Headaches
                        </span>
                    </h1>

                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        One platform for everything: storefronts, affiliate programs, email automation, and analytics. <span className="text-brand font-semibold">30-day free trial.</span> No credit card required.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/login?mode=register">
                            <Button size="lg" className="bg-brand text-white hover:bg-brand/90 font-black rounded-xl h-14 px-8 text-base shadow-lg shadow-brand/25">
                                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="border-border/50 rounded-xl h-14 px-8 text-base font-bold">
                            Watch Demo (2 min)
                        </Button>
                    </div>

                    <p className="text-sm text-muted-foreground">✓ No credit card required · ✓ Takes 2 minutes · ✓ Full feature access</p>
                </div>

                {/* Social Proof */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="rounded-2xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm text-center">
                        <div className="text-4xl font-black bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent mb-2">2,847</div>
                        <p className="text-sm text-muted-foreground">Active Creators</p>
                    </div>
                    <div className="rounded-2xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm text-center">
                        <div className="text-4xl font-black bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent mb-2">$12.4M</div>
                        <p className="text-sm text-muted-foreground">Revenue Generated</p>
                    </div>
                    <div className="rounded-2xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm text-center">
                        <div className="text-4xl font-black bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent mb-2">4.9★</div>
                        <p className="text-sm text-muted-foreground">Average Rating</p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-black mb-2">Everything You Need</h2>
                        <p className="text-muted-foreground">All-in-one platform with premium features</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                            { icon: Zap, title: "Product Storefront", desc: "Beautiful sales pages that convert. Built-in Whop payments." },
                            { icon: Users, title: "Affiliate Program", desc: "Let your audience earn commissions selling your products." },
                            { icon: TrendingUp, title: "Email Sequences", desc: "Automated email drips to nurture prospects and customers." },
                            { icon: BarChart3, title: "Advanced Analytics", desc: "Track revenue, conversions, affiliate performance, and more." },
                            { icon: Lock, title: "Custom Domains", desc: "White-label your store with your own domain name." },
                            { icon: Sparkles, title: "AI Bio Generator", desc: "AI-powered descriptions that sell. Powered by Google Gemini." },
                        ].map(({ icon: Icon, title, desc }, idx) => (
                            <div key={idx} className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm group hover:bg-surface-raised transition-colors">
                                <Icon className="h-8 w-8 text-brand mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="font-bold text-white mb-2">{title}</h3>
                                <p className="text-sm text-muted-foreground">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing */}
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-black mb-2">Simple Pricing</h2>
                        <p className="text-muted-foreground">Start free, scale as you grow</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Starter */}
                        <div className="rounded-2xl border border-border/50 bg-surface-raised/50 p-8 backdrop-blur-sm">
                            <h3 className="text-2xl font-black text-white mb-2">Starter</h3>
                            <p className="text-muted-foreground text-sm mb-6">Perfect for getting started</p>
                            <div className="text-4xl font-black text-brand mb-1">$29<span className="text-lg text-muted-foreground">/mo</span></div>
                            <p className="text-sm text-muted-foreground mb-6">Billed monthly</p>
                            <Button variant="outline" className="w-full mb-6 rounded-lg h-11 font-bold">Get Started</Button>
                            <ul className="space-y-3">
                                {["Up to 10 products", "Email sequences", "Affiliate program", "Basic analytics", "1 custom domain"].map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-sm text-white/80">
                                        <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Creator (Popular) */}
                        <div className="rounded-2xl border-2 border-brand bg-gradient-to-br from-brand/10 to-accent/10 p-8 backdrop-blur-sm relative">
                            <div className="absolute -top-3 left-6 px-3 py-1 bg-brand rounded-full text-[10px] font-black text-white uppercase tracking-wider">Most Popular</div>
                            <h3 className="text-2xl font-black text-white mb-2">Creator</h3>
                            <p className="text-muted-foreground text-sm mb-6">For scaling creators</p>
                            <div className="text-4xl font-black text-brand mb-1">$79<span className="text-lg text-muted-foreground">/mo</span></div>
                            <p className="text-sm text-muted-foreground mb-6">Billed monthly</p>
                            <Button className="w-full mb-6 rounded-lg h-11 font-bold bg-brand text-white hover:bg-brand/90">Start Free Trial</Button>
                            <ul className="space-y-3">
                                {["Unlimited products", "Advanced email sequences", "Affiliate program", "Advanced analytics", "Unlimited domains", "AI bio generator", "Priority support"].map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-sm text-white/80">
                                        <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-black text-center">Questions?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                            { q: "Do you offer a free trial?", a: "Yes! 30 days free access to all features. No credit card required." },
                            { q: "Can I use my own domain?", a: "Yes, unlimited custom domains on all plans." },
                            { q: "How do payments work?", a: "We use Whop for payments. You get paid to your bank account weekly." },
                            { q: "Can I cancel anytime?", a: "Yes, cancel at any time. No long-term contracts." },
                        ].map(({ q, a }, idx) => (
                            <div key={idx} className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                                <h4 className="font-bold text-white mb-2">{q}</h4>
                                <p className="text-sm text-muted-foreground">{a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="rounded-2xl border border-brand/30 bg-gradient-to-r from-brand/10 to-accent/10 p-8 sm:p-12 text-center space-y-6 backdrop-blur-sm">
                    <h2 className="text-3xl sm:text-4xl font-black">Ready to Start?</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Join 2,847+ creators who are building profitable businesses with bio page.store.
                    </p>
                    <Link href="/login?mode=register">
                        <Button size="lg" className="bg-brand text-white hover:bg-brand/90 font-black rounded-xl h-14 px-8 text-base shadow-lg shadow-brand/25">
                            Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <p className="text-xs text-muted-foreground/60">30 days free · No credit card · Cancel anytime</p>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 border-t border-border/50 mt-20 py-8 text-center text-sm text-muted-foreground/60">
                © 2025 bio page.store · All Rights Reserved
            </footer>
        </div>
    );
}
