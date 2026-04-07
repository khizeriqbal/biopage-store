import { CheckCircle2, TrendingUp, Users, Repeat, Brain, DollarSign } from "lucide-react";

const REASONS = [
    {
        icon: DollarSign,
        title: "100% Front-End Commission — You Keep Every Dollar",
        desc: "We take $0 on the FE. Every $17 sale goes straight to your PayPal or bank. No waiting, no splits, instant commission.",
        color: "text-[#C6FF4E]",
        bg: "bg-[#C6FF4E]/10 border-[#C6FF4E]/20",
    },
    {
        icon: TrendingUp,
        title: "Proven $2.00+ EPC In Internal Testing",
        desc: "Our internal launch to a cold audience hit $2.14 EPC. With a warm list, you'll easily see $3–$5 EPC. List-friendly offer with mass market appeal.",
        color: "text-[#5C4EFA]",
        bg: "bg-[#5C4EFA]/10 border-[#5C4EFA]/20",
    },
    {
        icon: Users,
        title: "Massive, Evergreen Niche — Creator Economy",
        desc: "The creator economy is a $250B market growing 20% per year. ANYONE with an online audience is a potential buyer. Coaches, consultants, course creators, influencers.",
        color: "text-blue-400",
        bg: "bg-blue-400/10 border-blue-400/20",
    },
    {
        icon: Repeat,
        title: "Recurring Backend — Earn Monthly Forever",
        desc: "After the launch promo, buyers upgrade to our $9/mo Starter or $29/mo Pro plan. You earn 30% recurring commissions on every monthly renewal. Passive income on autopilot.",
        color: "text-purple-400",
        bg: "bg-purple-400/10 border-purple-400/20",
    },
    {
        icon: Brain,
        title: "AI-Powered Product That Sells Itself",
        desc: "Built-in Gemini AI writes bios and product descriptions. The WOW factor is immediate. Buyers see value in 60 seconds — that means fewer refunds and higher stick rate.",
        color: "text-pink-400",
        bg: "bg-pink-400/10 border-pink-400/20",
    },
];

export function JvWhyPromote() {
    return (
        <section className="py-16 border-b border-white/10">
            <div className="text-center mb-12">
                <p className="text-[#5C4EFA] text-xs font-black uppercase tracking-widest mb-3">The Opportunity</p>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">5 Reasons Top Affiliates Are Excited About This Launch</h2>
            </div>

            <div className="grid gap-5">
                {REASONS.map((r, i) => (
                    <div key={i} className={`flex gap-5 p-6 rounded-2xl border ${r.bg} transition-all hover:scale-[1.01]`}>
                        <div className={`h-12 w-12 rounded-xl border ${r.bg} flex items-center justify-center shrink-0`}>
                            <r.icon className={`h-6 w-6 ${r.color}`} />
                        </div>
                        <div>
                            <h3 className="font-black text-white text-lg mb-1">{r.title}</h3>
                            <p className="text-white/60 text-sm leading-relaxed">{r.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
