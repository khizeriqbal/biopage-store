"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { CreatorTestimonials } from "@/components/CreatorTestimonials";
import Link from "next/link";
import { ArrowRight, Zap, TrendingUp, Users, Star, Check, ChevronDown, ChevronUp, Mail, Palette, Zap as ZapIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

const FEATURES = [
    { icon: Zap, title: "0% Commission", description: "Keep 95% of every sale. No hidden fees." },
    { icon: ZapIcon, title: "AI Content Writer", description: "Auto-generate bios, descriptions, and product copy." },
    { icon: Mail, title: "Email Marketing", description: "Built-in email list, sequences, and automation." },
    { icon: TrendingUp, title: "Analytics & Tracking", description: "Real-time revenue, sales, and visitor insights." },
    { icon: Users, title: "Affiliate Program", description: "Earn recurring commissions from referrals." },
    { icon: Palette, title: "Custom Domain", description: "Use your own domain and brand your store." },
];

const FAQS = [
    {
        question: "How much does it cost?",
        answer: "Bio page.store starts at $17 for the first 7 days of launch, then $27 for the next week, and $37/month after that. All plans include unlimited products, AI features, and email marketing.",
    },
    {
        question: "What can I sell?",
        answer: "You can sell anything digital: courses, templates, ebooks, software, art, music, coaching sessions, memberships, and more. Physical products coming soon.",
    },
    {
        question: "Do you take a commission?",
        answer: "No! You keep 100% of your sales minus payment processing fees (typically 2-3% from Whop). Zero platform commission.",
    },
    {
        question: "Can I use my own domain?",
        answer: "Yes! Premium accounts can use custom domains. Just point your domain DNS to our servers and you're set.",
    },
    {
        question: "Is there a refund guarantee?",
        answer: "Yes, 30-day money-back guarantee on the platform. Your customers get a 14-day refund window by default (customizable).",
    },
    {
        question: "How do payments work?",
        answer: "We use Whop for payment processing. When customers buy, the money goes directly to your Whop account. You can withdraw anytime.",
    },
    {
        question: "Can I integrate email marketing?",
        answer: "Yes! Subscribers are automatically added to your email list. Integrate with Zapier, Make, or our API to sync with ConvertKit, ActiveCampaign, etc.",
    },
    {
        question: "How do I get support?",
        answer: "Email support, community Slack channel, documentation, and video tutorials included. Premium plans get priority support.",
    },
];

function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const launchDate = new Date(2026, 3, 18, 23, 59, 59); // April 18, 2026

        const updateCountdown = () => {
            const now = new Date();
            const difference = launchDate.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="inline-flex gap-3 py-2 px-4 rounded-lg bg-brand/10 border border-brand/20 text-sm font-semibold">
            <div className="text-center">
                <div className="text-brand">{String(timeLeft.days).padStart(2, "0")}</div>
                <div className="text-xs text-muted-foreground">days</div>
            </div>
            <div className="text-brand">:</div>
            <div className="text-center">
                <div className="text-brand">{String(timeLeft.hours).padStart(2, "0")}</div>
                <div className="text-xs text-muted-foreground">hrs</div>
            </div>
            <div className="text-brand">:</div>
            <div className="text-center">
                <div className="text-brand">{String(timeLeft.minutes).padStart(2, "0")}</div>
                <div className="text-xs text-muted-foreground">min</div>
            </div>
            <div className="text-brand">:</div>
            <div className="text-center">
                <div className="text-brand">{String(timeLeft.seconds).padStart(2, "0")}</div>
                <div className="text-xs text-muted-foreground">sec</div>
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-white/10 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition text-left"
            >
                <span className="font-semibold text-white">{question}</span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-brand" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
            </button>
            {isOpen && (
                <div className="px-6 py-4 bg-white/5 border-t border-white/10 text-muted-foreground">
                    {answer}
                </div>
            )}
        </div>
    );
}

export default function HomePage() {
    const router = useRouter();
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-dark-bg flex flex-col text-white">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-brand/20 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-accent/10 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <header className="relative z-10 w-full py-4 border-b border-white/5 bg-white/2 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
                    <Logo />
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/sales" className="text-sm text-muted-foreground hover:text-white transition">
                            For Creators
                        </Link>
                        <Link href="/jv" className="text-sm text-muted-foreground hover:text-white transition">
                            Affiliate Program
                        </Link>
                        <Link href="#faq" className="text-sm text-muted-foreground hover:text-white transition">
                            FAQ
                        </Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">Sign In</Button>
                        </Link>
                        <Link href={user ? "/dashboard" : "/login"}>
                            <Button size="sm" className="bg-brand hover:bg-brand/90">
                                {user ? "Dashboard" : "Get Started"}
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 flex-1 flex items-center justify-center px-4 py-20">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-block">
                        <CountdownTimer />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05]">
                            Sell anything.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-purple-400 to-accent">
                                Keep 95%.
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            The creator platform with 0% commission, built-in AI, email automation, and everything you need to build a profitable digital business.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/sales">
                            <Button size="lg" className="bg-brand hover:bg-brand/90 w-full sm:w-auto">
                                Claim Your Creator Store
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/jv">
                            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 w-full sm:w-auto">
                                I'm an Affiliate
                            </Button>
                        </Link>
                    </div>

                    <div className="pt-8 border-t border-white/10">
                        <p className="text-xs text-muted-foreground mb-6">Trusted by creators worldwide</p>
                        <div className="grid grid-cols-3 gap-8">
                            <div className="text-center">
                                <p className="text-3xl font-bold">10K+</p>
                                <p className="text-xs text-muted-foreground">Active Creators</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold">$2M+</p>
                                <p className="text-xs text-muted-foreground">Revenue Processed</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold">99.9%</p>
                                <p className="text-xs text-muted-foreground">Uptime</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Creator Testimonials */}
            <section className="relative z-10 bg-white/2 border-y border-white/5 py-16">
                <CreatorTestimonials />
            </section>

            {/* Features Section */}
            <section className="relative z-10 px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Why Choose bio page.store?</h2>
                        <p className="text-muted-foreground">Everything you need to build a profitable creator business</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {FEATURES.map(({ icon: Icon, title, description }, idx) => (
                            <div key={idx} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-brand/50 transition">
                                <Icon className="w-8 h-8 text-brand mb-4" />
                                <h3 className="font-bold text-lg mb-2">{title}</h3>
                                <p className="text-muted-foreground text-sm">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="relative z-10 px-4 py-16 bg-white/2 border-y border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-muted-foreground mb-12">No hidden fees. No commission on sales.</p>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                            <p className="text-sm text-brand font-semibold mb-2">DAYS 1-3</p>
                            <p className="text-4xl font-bold mb-1">$17</p>
                            <p className="text-muted-foreground text-sm mb-4">Launch Price</p>
                            <Button variant="outline" className="w-full border-white/20" size="sm">Select</Button>
                        </div>

                        <div className="p-6 rounded-xl border border-brand bg-white/5 relative md:scale-105 md:z-10">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-dark-bg text-xs font-bold px-3 py-1 rounded-full">
                                BEST VALUE
                            </div>
                            <p className="text-sm text-brand font-semibold mb-2">DAYS 4-7</p>
                            <p className="text-4xl font-bold mb-1">$27</p>
                            <p className="text-muted-foreground text-sm mb-4">Still Discounted</p>
                            <Button className="w-full bg-brand hover:bg-brand/90" size="sm">Select</Button>
                        </div>

                        <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                            <p className="text-sm text-brand font-semibold mb-2">REGULAR</p>
                            <p className="text-4xl font-bold mb-1">$37</p>
                            <p className="text-muted-foreground text-sm mb-4">Per Month</p>
                            <Button variant="outline" className="w-full border-white/20" size="sm">Select</Button>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-8 border border-white/10">
                        <h3 className="font-bold text-lg mb-6">All plans include:</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                "Unlimited products",
                                "AI content generator",
                                "Email marketing & automation",
                                "Advanced analytics",
                                "Affiliate program access",
                                "Custom domain support",
                                "Email support",
                                "30-day money-back guarantee",
                            ].map((feature) => (
                                <div key={feature} className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-brand flex-shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="relative z-10 px-4 py-16">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
                    <p className="text-center text-muted-foreground mb-12">Everything you need to know</p>

                    <div className="space-y-3">
                        {FAQS.map((faq, idx) => (
                            <FAQItem key={idx} {...faq} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="relative z-10 px-4 py-16 bg-gradient-to-r from-brand/10 to-accent/10 border-y border-white/10">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h2 className="text-4xl font-bold">Ready to build your creator store?</h2>
                    <p className="text-lg text-muted-foreground">Join 10,000+ creators earning passive income</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/sales">
                            <Button size="lg" className="bg-brand hover:bg-brand/90">
                                Get Started Now
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/jv">
                            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5">
                                Join as Affiliate
                            </Button>
                        </Link>
                    </div>
                    <p className="text-sm text-muted-foreground">✓ No credit card required • ✓ 30-day money-back guarantee • ✓ Live support</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 bg-white/2 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-4 py-16">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <Logo />
                            <p className="text-sm text-muted-foreground mt-4">The creator platform built for creators, by creators.</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/sales" className="hover:text-white transition">For Creators</Link></li>
                                <li><Link href="/jv" className="hover:text-white transition">Affiliate Program</Link></li>
                                <li><Link href="#faq" className="hover:text-white transition">FAQ</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/" className="hover:text-white transition">About</Link></li>
                                <li><Link href="/" className="hover:text-white transition">Contact</Link></li>
                                <li><Link href="/" className="hover:text-white transition">Blog</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/" className="hover:text-white transition">Privacy</Link></li>
                                <li><Link href="/" className="hover:text-white transition">Terms</Link></li>
                                <li><Link href="/" className="hover:text-white transition">Refund Policy</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 text-center text-sm text-muted-foreground">
                        <p>&copy; 2026 bio page.store. All rights reserved. | Built with ❤️ for creators</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
