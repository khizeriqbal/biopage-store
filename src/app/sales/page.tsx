"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import Link from "next/link";
import { CheckCircle2, ArrowRight, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

const FEATURES = [
  "Unlimited digital products",
  "Accept payments with Whop",
  "Email list & automation",
  "AI-powered descriptions",
  "Custom domain support",
  "Affiliate marketing tools",
  "Real-time analytics",
  "Email sequences",
];

const TESTIMONIALS = [
  {
    name: "Sarah Johnson",
    quote: "Made $12K in 30 days. This platform changed my business.",
    niche: "Marketing Coach",
  },
  {
    name: "Marcus Chen",
    quote: "The AI features saved me hours every week. Worth every penny.",
    niche: "Designer",
  },
  {
    name: "Emma Rodriguez",
    quote: "0% commission means I actually make money. Finally!",
    niche: "Fitness Coach",
  },
];

const FAQS = [
  {
    question: "What exactly am I getting for $17?",
    answer: "You get a fully functional digital store with unlimited products, email marketing, AI content generation, analytics, custom domain support, affiliate program access, and 30 days of money-back guarantee.",
  },
  {
    question: "When will the price increase?",
    answer: "Launch pricing is $17 for the first 7 days, then $27 for days 8-14, then $37/month after that. Lock in the lowest price now.",
  },
  {
    question: "Is there a setup fee or hidden costs?",
    answer: "No hidden costs. Only payment processing fees (typically 2-3% from Whop). Everything else is included in your monthly subscription.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. Cancel anytime. No questions asked. Plus, you get a 30-day money-back guarantee if you're not happy.",
  },
  {
    question: "Will my customers pay transaction fees?",
    answer: "Yes, customers pay standard payment processing fees (2-3%), but you keep 100% of the product price minus those fees. No platform commission.",
  },
  {
    question: "How long does setup take?",
    answer: "5 minutes. Enter your details, set up your store, add a product, and you're live. We've optimized the onboarding process for speed.",
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
    <div className="inline-flex gap-3 py-2 px-4 rounded-lg bg-red-500/10 border border-red-500/30">
      <div className="text-center">
        <div className="text-red-500 font-bold">{String(timeLeft.days).padStart(2, "0")}</div>
        <div className="text-xs text-red-400">days</div>
      </div>
      <div className="text-red-500">:</div>
      <div className="text-center">
        <div className="text-red-500 font-bold">{String(timeLeft.hours).padStart(2, "0")}</div>
        <div className="text-xs text-red-400">hrs</div>
      </div>
      <div className="text-red-500">:</div>
      <div className="text-center">
        <div className="text-red-500 font-bold">{String(timeLeft.minutes).padStart(2, "0")}</div>
        <div className="text-xs text-red-400">min</div>
      </div>
      <div className="text-red-500">:</div>
      <div className="text-center">
        <div className="text-red-500 font-bold">{String(timeLeft.seconds).padStart(2, "0")}</div>
        <div className="text-xs text-red-400">sec</div>
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

export default function SalesPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-brand/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      {/* Sticky CTA Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-dark-bg/80 backdrop-blur-sm transition">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm">
              <CountdownTimer />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">$17</span>
              <Link href="/login">
                <Button size="sm" className="bg-brand hover:bg-brand/90">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block sm:hidden">
            <CountdownTimer />
          </div>

          <div className="space-y-4">
            <div className="inline-block px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30">
              <span className="text-sm font-semibold text-red-400">⚡ LIMITED TIME: Launch Pricing Active</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05]">
              Launch Your Digital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-purple-400 to-accent">
                Money Machine
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Sell digital products, manage email subscribers, and earn passive income — all from one beautiful, AI-powered store. 0% commission. 30-day guarantee.
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/login">
              <Button size="lg" className="bg-brand hover:bg-brand/90 w-full sm:w-auto px-8">
                Claim Your Store for $17
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">✓ 5-minute setup • ✓ 30-day refund guarantee • ✓ No credit card required</p>
          </div>
        </div>
      </section>

      {/* VSL Video Placeholder */}
      <section className="relative z-10 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl overflow-hidden border border-white/10 bg-black/50 aspect-video flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-brand/20 border border-brand flex items-center justify-center mx-auto mb-4">
                <div className="w-0 h-0 border-l-8 border-r-0 border-t-5 border-b-5 border-l-brand border-t-transparent border-b-transparent ml-1" />
              </div>
              <p className="text-muted-foreground">Video Sales Letter Coming Soon</p>
              <p className="text-xs text-muted-foreground mt-2">Walkthrough of exactly how to make your first sale</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points & Solution */}
      <section className="relative z-10 px-4 py-16 bg-white/2 border-y border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">The Problem With Other Platforms</h2>

          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-white mb-1">Stan Store charges 5% commission</p>
                <p className="text-muted-foreground text-sm">On a $1,000 sale, you lose $50 to fees.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-white mb-1">Complex email setup required</p>
                <p className="text-muted-foreground text-sm">You need to learn Zapier, Make, and email integration.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-white mb-1">No AI features included</p>
                <p className="text-muted-foreground text-sm">You write all product copy, bios, and descriptions manually.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-white mb-1">No affiliate program</p>
                <p className="text-muted-foreground text-sm">You're missing the fastest growth channel available.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-6">We Solved All Of It</h3>
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {[
                "0% commission on sales",
                "Email automation built-in",
                "AI writes your copy",
                "Affiliate program included",
              ].map((solution) => (
                <div key={solution} className="flex items-center gap-3 p-4 rounded-lg bg-brand/10 border border-brand/20">
                  <CheckCircle2 className="w-5 h-5 text-brand flex-shrink-0" />
                  <span className="font-medium">{solution}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Everything Included</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div key={f} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-brand/50 transition">
                <CheckCircle2 className="w-6 h-6 text-brand mb-3" />
                <p className="text-white font-medium">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 px-4 py-16 bg-white/2 border-y border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Creators Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/80 italic mb-4">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-brand">{t.niche}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing/CTA */}
      <section className="relative z-10 px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground mb-12">No commission. No hidden fees. Just you and your revenue.</p>

          <div className="p-10 rounded-2xl bg-gradient-to-br from-brand/20 to-accent/20 border border-brand/30 mb-6">
            <div className="inline-block px-4 py-1 rounded-full bg-brand/20 border border-brand/50 mb-4">
              <span className="text-sm font-semibold text-brand">LIMITED TIME OFFER</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Starter Plan</h3>
            <div className="text-6xl font-black text-white mb-2">$17</div>
            <p className="text-muted-foreground mb-6">Then $27/month for days 8-14, then $37/month</p>
            <Link href="/login" className="block">
              <Button size="lg" className="w-full bg-brand hover:bg-brand/90">
                Start Your Store Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-4">30-day money-back guarantee • 5-minute setup • No credit card</p>
          </div>

          <p className="text-sm text-muted-foreground mb-8">🎁 Limited to 1,000 early birds at launch pricing</p>

          <div className="bg-white/5 rounded-xl p-8 border border-white/10">
            <h3 className="font-bold text-lg mb-6 text-white">Everything Included:</h3>
            <div className="grid md:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
              {[
                "Unlimited digital products",
                "Email list management",
                "AI content generator",
                "Email automation",
                "Advanced analytics",
                "Affiliate program",
                "Custom domain",
                "24/7 support",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 px-4 py-16 bg-white/2 border-y border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">FAQ</h2>
          <p className="text-center text-muted-foreground mb-12">Common questions about getting started</p>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <FAQItem key={idx} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to launch?</h2>
          <p className="text-lg text-muted-foreground">Join 10,000+ creators building profitable digital businesses</p>

          <Link href="/login">
            <Button size="lg" className="bg-brand hover:bg-brand/90 px-8">
              Get Started for $17
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground">
            ✓ 5-minute setup • ✓ 30-day guarantee • ✓ Support included • ✓ No credit card
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-white/2 backdrop-blur-sm py-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 bio page.store. All rights reserved. | <Link href="/" className="hover:text-white transition">Privacy</Link> • <Link href="/" className="hover:text-white transition">Terms</Link> • <Link href="/" className="hover:text-white transition">Refund Policy</Link></p>
        </div>
      </footer>
    </div>
  );
}
