"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import Link from "next/link";
import { CheckCircle2, Copy, TrendingUp, Users, DollarSign, Award } from "lucide-react";

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
    <div className="inline-flex gap-3 py-2 px-4 rounded-lg bg-brand/10 border border-brand/20">
      <div className="text-center">
        <div className="text-brand font-bold">{String(timeLeft.days).padStart(2, "0")}</div>
        <div className="text-xs text-muted-foreground">days</div>
      </div>
      <div className="text-brand">:</div>
      <div className="text-center">
        <div className="text-brand font-bold">{String(timeLeft.hours).padStart(2, "0")}</div>
        <div className="text-xs text-muted-foreground">hrs</div>
      </div>
      <div className="text-brand">:</div>
      <div className="text-center">
        <div className="text-brand font-bold">{String(timeLeft.minutes).padStart(2, "0")}</div>
        <div className="text-xs text-muted-foreground">min</div>
      </div>
      <div className="text-brand">:</div>
      <div className="text-center">
        <div className="text-brand font-bold">{String(timeLeft.seconds).padStart(2, "0")}</div>
        <div className="text-xs text-muted-foreground">sec</div>
      </div>
    </div>
  );
}

function JVSignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setSubmitted(true);
      setTimeout(() => {
        setName("");
        setEmail("");
        setSubmitted(false);
      }, 3000);
    }
  };

  if (submitted) {
    return (
      <div className="p-8 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <p className="text-white font-semibold mb-2">Welcome to the JV Program! 🎉</p>
        <p className="text-muted-foreground">Check your email for your affiliate link and resources.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand"
        required
      />
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand"
        required
      />
      <Button type="submit" size="lg" className="w-full bg-brand hover:bg-brand/90">
        Get Your Affiliate Link
      </Button>
    </form>
  );
}

export default function JVPage() {
  const [copied, setCopied] = useState("");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  const emailSwipes = [
    {
      id: 1,
      subject: "Why are 10,000 creators switching to THIS?",
      body: "Hey!\n\nI just found a creator platform that's changing the game.\n\n0% commission. AI included. Built-in email marketing.\n\nCheck it out: [AFFILIATE_LINK]\n\nThey're doing a limited launch at $17/month.",
    },
    {
      id: 2,
      subject: "Stan.store charges 5%… this doesn't",
      body: "If you're paying 5% commission on every sale, we need to talk.\n\nThere's a new platform that charges 0%. Seriously.\n\nYou keep 100% of sales. Plus AI features. Plus email automation.\n\nWatch: [AFFILIATE_LINK]",
    },
    {
      id: 3,
      subject: "⏰ Launch price expires in 3 days",
      body: "Quick heads up:\n\nIf you wanted to try a new creator store platform, prices are going up in 3 days.\n\n$17 launch → $27 next week → $37 after that.\n\nIf you're interested: [AFFILIATE_LINK]",
    },
    {
      id: 4,
      subject: "She made $4,200 in 30 days (here's how)",
      body: "One of my contacts just shared her results using bio page.store:\n\n→ $4,200 revenue\n→ 487 sales\n→ 156 email subscribers\n\nIn 30 days.\n\nHere's the platform: [AFFILIATE_LINK]\n\nTry it at launch pricing while it lasts.",
    },
    {
      id: 5,
      subject: "AI writes your bio. You keep 95%.",
      body: "I'm obsessed with this platform:\n\n✓ AI writes product descriptions\n✓ Email automation built-in\n✓ Zero commission\n✓ Custom domains\n✓ Affiliate program included\n\nFive minutes to set up. No coding.\n\n[AFFILIATE_LINK]",
    },
  ];

  const socialSwipes = [
    {
      platform: "Twitter/X",
      text: "Just found this: a creator platform that charges 0% commission and includes AI features.\n\nNo joke. You keep 100% of sales + get built-in email marketing.\n\nLaunch pricing: $17/month (today only)\n\nCheck it: [AFFILIATE_LINK]\n\n#creators #entrepreneurship",
    },
    {
      platform: "Facebook",
      text: "If you're building a digital business, this changes everything.\n\nNew platform just launched with:\n✓ 0% commission (you keep everything!)\n✓ AI content generator\n✓ Email marketing automation\n✓ Affiliate program (earn recurring)\n\nSpecial launch price: $17/month\n\nJoin 10,000+ creators:\n[AFFILIATE_LINK]",
    },
    {
      platform: "Instagram Caption",
      text: "Building your digital empire? 💎\n\n🚀 Just discovered bio page.store\n✓ 0% commission\n✓ AI-powered\n✓ Email automation\n✓ $17 launch price\n\nLink in bio for affiliate program details 📎",
    },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-brand/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-white/5 sticky top-0 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/sales">
            <Button variant="ghost">Back to Sales Page</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block">
            <CountdownTimer />
          </div>

          <div className="inline-block px-4 py-2 rounded-full bg-brand/20 border border-brand/30">
            <span className="text-sm font-medium">🤝 JV Partner Program</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[1.05]">
            Finally — A Creator Platform<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-purple-400 to-accent">
              That Pays You 100%
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Promote bio page.store and earn $17 per sale (100% commission) + 50% on 4 high-converting upsells averaging $65 cart value.
          </p>

          <div className="pt-4">
            <h3 className="text-sm font-semibold text-brand mb-4">PROJECTED EARNINGS PER 100 VISITORS</h3>
            <div className="grid md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-2xl font-bold text-brand">$180</p>
                <p className="text-xs text-muted-foreground">Front End Sales</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-2xl font-bold text-brand">$240</p>
                <p className="text-xs text-muted-foreground">OTO Commissions</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-2xl font-bold text-brand">$420</p>
                <p className="text-xs text-muted-foreground">Total Earnings</p>
              </div>
              <div className="p-4 rounded-lg bg-brand/20 border border-brand/50">
                <p className="text-2xl font-bold">2.1%</p>
                <p className="text-xs text-muted-foreground">Conversion Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Promote */}
      <section className="relative z-10 px-4 py-16 bg-white/2 border-y border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Promote bio page.store?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: DollarSign,
                title: "100% FE Commission",
                desc: "Keep every single dollar on front-end sales. No splits.",
              },
              {
                icon: TrendingUp,
                title: "Proven $2+ EPC",
                desc: "Tested with real promoters. Consistent conversions.",
              },
              {
                icon: Users,
                title: "Hot Evergreen Niche",
                desc: "Creator economy growing 20% yearly. Unlimited market.",
              },
              {
                icon: Award,
                title: "Recurring Backend",
                desc: "$9/month subscription = lifetime earnings from each sale.",
              },
              {
                icon: CheckCircle2,
                title: "AI-Powered Hook",
                desc: "Built-in Gemini AI is a compelling selling feature.",
              },
              {
                icon: Users,
                title: "JV Manager Support",
                desc: "We help you succeed. Dedicated support + resources.",
              },
            ].map(({ icon: Icon, title, desc }, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-brand/50 transition">
                <Icon className="w-6 h-6 text-brand mb-3" />
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="relative z-10 px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Commission Structure</h2>
          <p className="text-center text-muted-foreground mb-12">Transparent pricing. Maximum earnings.</p>

          <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
            <table className="w-full text-left">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-white font-semibold">Product</th>
                  <th className="px-6 py-4 text-white font-semibold">Price</th>
                  <th className="px-6 py-4 text-white font-semibold">Your Commission</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Starter Plan (FE)", price: "$17 one-time", comm: "100% ($17.00)" },
                  { name: "Creator Pro (OTO1)", price: "$37/month", comm: "50% ($18.50)" },
                  { name: "DFY Templates (OTO2)", price: "$27", comm: "50% ($13.50)" },
                  { name: "Agency License (OTO3)", price: "$67", comm: "50% ($33.50)" },
                  { name: "Reseller Rights (OTO4)", price: "$197", comm: "50% ($98.50)" },
                ].map((row) => (
                  <tr key={row.name} className="border-b border-white/10 hover:bg-white/5">
                    <td className="px-6 py-4 text-white">{row.name}</td>
                    <td className="px-6 py-4 text-white">{row.price}</td>
                    <td className="px-6 py-4 text-brand font-bold">{row.comm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-6 rounded-xl bg-brand/10 border border-brand/30">
            <p className="text-center">
              <span className="text-2xl font-bold text-brand">$181</span>
              <span className="text-muted-foreground"> average earnings per customer</span>
            </p>
          </div>
        </div>
      </section>

      {/* Prize Contest */}
      <section className="relative z-10 px-4 py-16 bg-white/2 border-y border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Prize Leaderboard 🏆</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30">
              <div className="text-3xl font-black mb-2">🥇 1st Place</div>
              <p className="text-2xl font-bold text-white mb-1">$500</p>
              <p className="text-sm text-muted-foreground">Top affiliate this quarter</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-gray-400/20 to-gray-500/20 border border-gray-400/30">
              <div className="text-3xl font-black mb-2">🥈 2nd Place</div>
              <p className="text-2xl font-bold text-white mb-1">$250</p>
              <p className="text-sm text-muted-foreground">Second highest earnings</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30">
              <div className="text-3xl font-black mb-2">🥉 3rd Place</div>
              <p className="text-2xl font-bold text-white mb-1">$100</p>
              <p className="text-sm text-muted-foreground">Third highest earnings</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-3xl font-black mb-2">🎖️ 4-5th Place</div>
              <p className="text-2xl font-bold text-white mb-1">$50 each</p>
              <p className="text-sm text-muted-foreground">Bonus prizes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Email Swipes */}
      <section className="relative z-10 px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Email Swipes</h2>
          <p className="text-center text-muted-foreground mb-12">Ready-to-send email copy. Just insert your affiliate link.</p>
          <div className="space-y-4">
            {emailSwipes.map((swipe) => (
              <div key={swipe.id} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-brand/50 transition">
                <p className="font-semibold text-white mb-1">Subject: {swipe.subject}</p>
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

      {/* Social Swipes */}
      <section className="relative z-10 px-4 py-16 bg-white/2 border-y border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Social Media Swipes</h2>
          <p className="text-center text-muted-foreground mb-12">Ready-to-post content for your socials.</p>
          <div className="space-y-4">
            {socialSwipes.map((swipe, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <p className="font-semibold text-brand mb-3">{swipe.platform}</p>
                <p className="text-white whitespace-pre-wrap mb-4 text-sm">{swipe.text}</p>
                <button
                  onClick={() => copyToClipboard(swipe.text, `social-${idx}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-brand/20 hover:bg-brand/30 text-brand rounded-lg text-sm font-medium transition"
                >
                  <Copy className="w-4 h-4" />
                  {copied === `social-${idx}` ? "Copied!" : "Copy Post"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signup Section */}
      <section className="relative z-10 px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Join the Affiliate Program</h2>
          <p className="text-center text-muted-foreground mb-8">Sign up to get your unique affiliate link and marketing resources.</p>
          <JVSignupForm />
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-4 py-16 bg-gradient-to-r from-brand/10 to-accent/10 border-y border-white/10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to earn recurring commissions?</h2>
          <p className="text-lg text-muted-foreground">Start promoting and get paid every month from your referrals</p>
          <Button size="lg" className="bg-brand hover:bg-brand/90">
            Get Your Affiliate Link Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-white/2 backdrop-blur-sm py-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 bio page.store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
