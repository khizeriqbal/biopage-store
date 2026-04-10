import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function OTO1Page() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-12">
        <h1 className="text-4xl font-bold text-white">Creator Pro Upgrade</h1>
        <p className="text-2xl text-white">$37 <span className="text-muted-foreground text-lg">one-time</span></p>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">Get unlimited everything + advanced features to grow your business faster</p>
        
        <div className="space-y-3 text-left">
          {["Unlimited email subscribers", "Advanced analytics", "API access", "Priority support", "Custom integrations"].map((f) => (
            <div key={f} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand flex-shrink-0" />
              <span className="text-white">{f}</span>
            </div>
          ))}
        </div>

        <Link href="/login">
          <Button size="lg" className="bg-brand hover:bg-brand/90 w-full">
            Add to Cart - $37
          </Button>
        </Link>
        <Link href="/sales">
          <Button variant="outline" className="w-full border-white/20">Decline</Button>
        </Link>
      </div>
    </div>
  );
}
