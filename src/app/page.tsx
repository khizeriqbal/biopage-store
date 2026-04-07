"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Check,
  Zap,
  ShoppingBag,
  Video,
  Calendar,
  Users,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Award,
  Globe,
  Rocket
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg selection:bg-brand selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-20 border-b border-border bg-dark-bg/50 backdrop-blur-xl z-[100] px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <Logo />

          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-sm font-bold text-muted-foreground hover:text-white transition-colors cursor-pointer">Features</a>
            <a href="#pricing" className="text-sm font-bold text-muted-foreground hover:text-white transition-colors cursor-pointer">Pricing</a>
            <a href="#demo" className="text-sm font-bold text-muted-foreground hover:text-white transition-colors cursor-pointer">Demo</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-bold text-white hover:bg-surface-hover">Login</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-brand text-white hover:bg-brand/90 font-bold px-6 rounded-xl shadow-lg shadow-brand/20">
                Get Started <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-6 overflow-hidden relative">
        {/* Background Orbs */}
        <div className="absolute top-40 left-1/4 h-[500px] w-[500px] bg-brand/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute top-80 right-1/4 h-[600px] w-[600px] bg-accent/10 rounded-full blur-[150px] -z-10 animate-hover duration-[6000ms]" />

        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/20 bg-brand/5 animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles className="h-4 w-4 text-brand animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand">The next generation creator store</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-700">
            Sell your magic <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-accent to-brand bg-[length:200%_auto] animate-gradient-x">without the fees.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Better than Stan. Faster than Linktree. bio page.store is the all-in-one platform for high-performance creators to sell digital products, book clients, and grow their email list.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-16 bg-brand text-white hover:bg-brand/90 px-12 text-lg font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-brand/30 group">
                Start Your Store <Rocket className="h-5 w-5 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" className="w-full sm:w-auto h-16 border-border bg-surface-raised/40 hover:bg-surface-hover px-12 text-lg font-black uppercase tracking-widest rounded-2xl">
              View Demo
            </Button>
          </div>

          <div className="pt-20 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground mb-8">Trusted by 5,000+ top creators</p>
            <div className="flex flex-wrap items-center justify-center gap-10 opacity-30 grayscale filter invert">
              {/* Mock logos */}
              <div className="h-8 w-32 bg-white rounded flex items-center justify-center font-bold text-black px-4">FORBES</div>
              <div className="h-8 w-32 bg-white rounded flex items-center justify-center font-bold text-black px-4">INSIDER</div>
              <div className="h-8 w-32 bg-white rounded flex items-center justify-center font-bold text-black px-4">VICE</div>
              <div className="h-8 w-32 bg-white rounded flex items-center justify-center font-bold text-black px-4">COSMO</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-32 px-6 bg-surface/30">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Everything you need, none of the clutter.</h2>
            <p className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto">One beautiful link to replace your website, link-in-bio, and store.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Digital Goods", icon: ShoppingBag, desc: "Sell PDFs, presets, notion templates with automated delivery.", color: "bg-blue-500/10 text-blue-500" },
              { title: "Online Courses", icon: Video, desc: "Host video lessons and resources directly on your bio page.", color: "bg-brand/10 text-brand" },
              { title: "1:1 Coaching", icon: Calendar, desc: "Book consultation sessions integrated with your calendar.", color: "bg-accent/10 text-accent" },
              { title: "Memberships", icon: Users, desc: "Launch recurring subscriptions for your super fans.", color: "bg-purple-500/10 text-purple-400" },
            ].map((f) => (
              <div key={f.title} className="p-10 rounded-[2.5rem] bg-surface-raised/40 border border-border flex flex-col items-center text-center group hover:bg-surface-hover transition-all hover:-translate-y-2">
                <div className={cn("h-16 w-16 rounded-3xl flex items-center justify-center mb-10 shadow-xl group-hover:scale-110 transition-transform", f.color)}>
                  <f.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight mb-4">{f.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-32 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <Badge className="bg-brand/10 text-brand border-brand/20 font-black tracking-widest uppercase py-1 px-4 text-xs">AI Powered</Badge>
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-tight">
              Let Gemini write your <br /> bio & descriptions.
            </h2>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
              Our integrated AI assistant helps you write high-converting product descriptions and professional bios in seconds. Never stare at a blank page again.
            </p>

            <div className="space-y-4">
              {["Product Copywriting", "SEO Optimization", "Dynamic Price Suggestion"].map(f => (
                <div key={f} className="flex items-center gap-3 text-white font-bold">
                  <Check className="h-5 w-5 text-accent" /> {f}
                </div>
              ))}
            </div>

            <Button className="h-16 bg-surface-raised text-white hover:bg-surface-hover px-10 text-lg font-black uppercase tracking-widest rounded-2xl border border-border shadow-xl">
              Try AI Assistant
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-brand/30 rounded-full blur-[100px] -z-10" />
            <div className="rounded-[3rem] border-8 border-surface-raised bg-dark-bg p-8 shadow-[0_50px_100px_-20px_rgba(92,78,250,0.5)] transform rotate-2">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-brand/20" />
                  <div className="h-4 w-32 bg-surface rounded-full" />
                </div>
                <div className="h-32 w-full bg-surface-raised rounded-2xl border border-border animate-pulse flex items-center justify-center p-6 text-brand font-mono text-sm">
                  "Generating high-converting bio for your fitness niche..."
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-surface rounded-full" />
                  <div className="h-3 w-4/5 bg-surface rounded-full" />
                  <div className="h-3 w-3/4 bg-surface rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Using PlanSelector logic or just a static mockup */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">Transparent Pricing</h2>
            <p className="text-muted-foreground font-medium text-lg">Free forever. Only pay as you grow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* I'll use a simplified version of PlanSelector design here */}
            {[
              { name: "Forever Free", price: "$0", desc: "Test the waters.", features: ["3 Products", "500 Subscribers", "5% Platform Fee"] },
              { name: "Starter", price: "$9", desc: "Scale faster.", features: ["Unlimited Products", "5,000 Subscribers", "2% Platform Fee"], popular: true },
              { name: "Creator Pro", price: "$29", desc: "Expert control.", features: ["Unlimited Everything", "0% Platform Fee", "AI Assistant Access"] },
            ].map(p => (
              <div key={p.name} className={cn(
                "p-12 rounded-[3rem] border bg-surface-raised/40 backdrop-blur-md flex flex-col items-center text-center group transition-all duration-500",
                p.popular ? "border-brand ring-2 ring-brand/30 shadow-2xl scale-105 z-10" : "border-border hover:border-brand/30"
              )}>
                {p.popular && <Badge className="bg-brand text-white font-black uppercase tracking-widest py-1 px-4 rounded-full mb-6">Most Popular</Badge>}
                <h3 className="text-3xl font-black text-white tracking-tight mb-2">{p.name}</h3>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-6xl font-black text-white">{p.price}</span>
                  <span className="text-sm font-bold text-muted-foreground uppercase">/mo</span>
                </div>
                <div className="flex-1 space-y-4 mb-10">
                  {p.features.map(f => (
                    <div key={f} className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                      <Check className="h-4 w-4 text-accent" /> {f}
                    </div>
                  ))}
                </div>
                <Link href="/login" className="w-full">
                  <Button className={cn(
                    "w-full h-16 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl active:scale-95 transition-all text-white",
                    p.popular ? "bg-brand hover:bg-brand/90" : "bg-surface-raised hover:bg-surface-hover"
                  )}>Choose {p.name}</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-border bg-surface/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <Logo />
            <p className="text-muted-foreground font-medium max-w-sm leading-relaxed">
              Join 10,000+ creators who are building their digital empires on bio page.store. The only link you'll ever need.
            </p>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-surface-raised flex items-center justify-center text-muted-foreground hover:text-white transition-colors cursor-pointer"><Globe className="h-5 w-5" /></div>
              <div className="h-10 w-10 rounded-xl bg-surface-raised flex items-center justify-center text-muted-foreground hover:text-white transition-colors cursor-pointer"><Users className="h-5 w-5" /></div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">Company</h4>
            <div className="flex flex-col gap-4">
              <a href="#" className="text-sm font-bold text-muted-foreground hover:text-brand transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm font-bold text-muted-foreground hover:text-brand transition-colors">Terms of Service</a>
              <a href="#" className="text-sm font-bold text-muted-foreground hover:text-brand transition-colors">Refund Policy</a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">Support</h4>
            <div className="flex flex-col gap-4">
              <a href="#" className="text-sm font-bold text-muted-foreground hover:text-brand transition-colors">Help Center</a>
              <a href="#" className="text-sm font-bold text-muted-foreground hover:text-brand transition-colors">Creator Guide</a>
              <a href="#" className="text-sm font-bold text-muted-foreground hover:text-brand transition-colors">API Docs</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">© 2024 bio page.store. Built with ❤️ for creators.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase text-accent tracking-widest"><ShieldCheck className="h-3 w-3" /> Secure Payouts</span>
            <span className="flex items-center gap-2 text-[10px] font-black uppercase text-brand tracking-widest"><Award className="h-3 w-3" /> Best Value 2024</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
