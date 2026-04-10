import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import Link from "next/link";
import { ArrowRight, Zap, TrendingUp, Users, Star } from "lucide-react";

const FEATURES = [
    { icon: Zap, text: "Sell digital products in minutes" },
    { icon: TrendingUp, text: "Built-in analytics & revenue tracking" },
    { icon: Users, text: "Affiliate & referral marketing tools" },
    { icon: Star, text: "AI-powered bio & product descriptions" },
];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-brand/20 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

            <header className="relative z-10 w-full absolute top-0 left-0 right-0 py-4">
                <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
                    <Logo />
                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">Sign In</Button>
                        </Link>
                        <Link href="/login">
                            <Button size="sm" className="bg-brand hover:bg-brand/90">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="relative z-10 max-w-3xl text-center space-y-8 pt-20">
                <div className="flex justify-center">
                    <Logo />
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[1.05]">
                        Sell anything.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-purple-400 to-accent">
                            Build everything.
                        </span>
                    </h1>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                        The all-in-one creator storefront with payments, affiliates, email automation, and AI — all in one link.
                    </p>
                </div>

                <div className="space-y-3">
                    {FEATURES.map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
                                <Icon className="h-4 w-4 text-brand" />
                            </div>
                            <span className="text-sm text-white/80 font-medium">{text}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link href="/sales">
                        <Button size="lg" className="bg-brand hover:bg-brand/90 w-full sm:w-auto">
                            View Offer
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                    <Link href="/jv">
                        <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 w-full sm:w-auto">
                            For Affiliates
                        </Button>
                    </Link>
                </div>

                <div className="pt-4 text-xs text-muted-foreground/60">
                    🔒 Bank-grade encryption • 💳 Secure payments • 📊 Real-time analytics
                </div>

                <div className="pt-8 border-t border-white/10">
                    <p className="text-xs text-muted-foreground mb-4">Trusted by creators worldwide</p>
                    <div className="flex items-center justify-center gap-6">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">10K+</p>
                            <p className="text-xs text-muted-foreground">Active Creators</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">$2M+</p>
                            <p className="text-xs text-muted-foreground">Revenue Processed</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">99.9%</p>
                            <p className="text-xs text-muted-foreground">Uptime</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
