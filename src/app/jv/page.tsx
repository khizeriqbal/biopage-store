"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import Link from "next/link";
import { CheckCircle2, Copy } from "lucide-react";
import { useState } from "react";

export default function JVPage() {
  const [copied, setCopied] = useState("");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  const emailSwipes = [
    { id: 1, subject: "Why are 10,000 creators switching to THIS link-in-bio tool?", body: "Hey!\n\nI just discovered a tool that's changing the game for creators like us...\n\nCheck it out: [AFFILIATE_LINK]" },
    { id: 2, subject: "Stan.store charges 5%… this doesn't", body: "Quick question:\n\nIf you could keep 100% of your first sale instead of 95%, would you switch tools?\n\nThat's exactly what bio page.store offers. [AFFILIATE_LINK]" },
    { id: 3, subject: "⏰ Price goes up at midnight", body: "Last chance to lock in the launch price of $17!\n\nAfter tonight, it jumps to $27. Get it now: [AFFILIATE_LINK]" },
    { id: 4, subject: "She made $4,200 in 30 days with ONE link", body: "Here's her story and how you can do it too:\n\n[AFFILIATE_LINK]\n\nThe $17 launch price ends in 3 days." },
    { id: 5, subject: "AI writes your bio. You keep 95%", body: "Tired of complex tools?\n\nJust set it up once and start selling instantly. No coding. No headaches.\n\n[AFFILIATE_LINK]" },
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      <header className="border-b border-white/10 bg-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/"><Logo /></Link>
          <Link href="/sales"><Button variant="ghost">Back to Sales</Button></Link>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-block px-4 py-2 rounded-full bg-brand/20 border border-brand/30 text-brand text-sm font-medium">
            🤝 Affiliate Program
          </div>
          <h1 className="text-5xl font-black text-white">
            Earn 100% Commission<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-accent">On The Front End</span>
          </h1>
          <p className="text-xl text-muted-foreground">Promote bio page.store and earn $17 per sale + 50% on 4 high-converting upsells</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white/5 border-y border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Promote Bio Page Store?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "100% FE Commission", desc: "Keep every dollar on front-end sales" },
              { title: "Proven $2+ EPC", desc: "Tested with real money and real results" },
              { title: "Hot Evergreen Niche", desc: "Creator economy growing 20% yearly" },
              { title: "Recurring Backend", desc: "$9/mo subscription = lifetime earnings" },
              { title: "AI-Powered Hook", desc: "Product practically sells itself" },
              { title: "JV Manager Support", desc: "We're here to help you succeed" },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <CheckCircle2 className="w-6 h-6 text-brand mb-3" />
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Commission Structure</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-white font-semibold">Product</th>
                  <th className="px-4 py-3 text-white font-semibold">Price</th>
                  <th className="px-4 py-3 text-white font-semibold">Your Commission</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Starter Plan (FE)", price: "$17", comm: "100% ($17)" },
                  { name: "Creator Pro (OTO1)", price: "$37", comm: "50% ($18.50)" },
                  { name: "DFY Templates (OTO2)", price: "$27", comm: "50% ($13.50)" },
                  { name: "Agency License (OTO3)", price: "$67", comm: "50% ($33.50)" },
                  { name: "Reseller Rights (OTO4)", price: "$197", comm: "50% ($98.50)" },
                ].map((row) => (
                  <tr key={row.name} className="border-b border-white/10 hover:bg-white/5">
                    <td className="px-4 py-3 text-white">{row.name}</td>
                    <td className="px-4 py-3 text-white">{row.price}</td>
                    <td className="px-4 py-3 text-brand font-bold">{row.comm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white/5 border-y border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Email Swipes</h2>
          <div className="space-y-4">
            {emailSwipes.map((swipe) => (
              <div key={swipe.id} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition">
                <p className="font-semibold text-white mb-3">Subject: {swipe.subject}</p>
                <p className="text-muted-foreground text-sm whitespace-pre-wrap mb-4">{swipe.body}</p>
                <button
                  onClick={() => copyToClipboard(swipe.body, `email-${swipe.id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-brand/20 hover:bg-brand/30 text-brand rounded-lg text-sm font-medium transition"
                >
                  <Copy className="w-4 h-4" />
                  {copied === `email-${swipe.id}` ? "Copied!" : "Copy Email"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join the Affiliate Program</h2>
          <p className="text-muted-foreground mb-8">Sign up to get your unique affiliate link and start earning immediately.</p>
          <Link href="/login">
            <Button size="lg" className="bg-brand hover:bg-brand/90">Get Your Affiliate Link</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
