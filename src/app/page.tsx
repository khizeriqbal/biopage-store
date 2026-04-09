import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
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

export default async function HomePage() {
    const session = await auth();

    // Redirect logged-in users to dashboard
    if (session?.user?.id) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-brand/20 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl text-center space-y-8">
                {/* Logo */}
                <div className="flex justify-center">
                    <Logo />
                </div>

                {/* Headline */}
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

                {/* Features */}
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

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link href="/login?mode=register">
                        <Button className="h-12 px-8 bg-brand text-white hover:bg-brand/90 font-black uppercase tracking-widest rounded-xl shadow-lg shadow-brand/25">
                            Get Started Free
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="outline" className="h-12 px-8 border-border/50 hover:bg-surface-raised/50 font-black uppercase tracking-widest rounded-xl">
                            Sign In
                        </Button>
                    </Link>
                </div>

                {/* Trust badge */}
                <div className="pt-4 text-xs text-muted-foreground/60">
                    🔒 Bank-grade encryption • 💳 Secure payments • 📊 Real-time analytics
                </div>
            </div>
        </div>
    );
}
