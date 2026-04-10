import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function SalesPage() {
  const features = [
    "Create unlimited digital products",
    "Accept payments instantly with Whop",
    "Build email sequences automatically",
    "AI-powered product descriptions",
    "Custom domain support",
    "Affiliate marketing tools",
    "Real-time analytics & reporting",
    "Email subscriber management",
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><Logo /></Link>
          <div className="flex items-center gap-4">
            <Link href="/jv"><Button variant="ghost" size="sm">For Affiliates</Button></Link>
            <Link href="/login"><Button size="sm" className="bg-brand hover:bg-brand/90">Buy Now</Button></Link>
          </div>
        </div>
      </header>

      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
            Launch Your Creator Store <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-accent">Without Complexity</span>
          </h1>
          <p className="text-xl text-muted-foreground">Sell digital products, manage subscribers, and automate your business — all from one beautiful link.</p>
          <Link href="/login">
            <Button size="lg" className="bg-brand hover:bg-brand/90">Get Started for $17<ArrowRight className="w-4 h-4 ml-2" /></Button>
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 bg-white/5 border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Everything You Need</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <CheckCircle2 className="w-6 h-6 text-brand mb-4" />
                <p className="text-white">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Simple Pricing</h2>
          <div className="p-8 rounded-xl bg-gradient-to-br from-brand/20 to-accent/20 border border-brand/30">
            <h3 className="text-2xl font-bold text-white mb-2">Starter Plan</h3>
            <p className="text-4xl font-bold text-white mb-6">$17</p>
            <Link href="/login" className="block">
              <Button className="w-full bg-brand hover:bg-brand/90">Start Now</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
