import { TrendingUp, ShoppingCart, RefreshCw, Star, DollarSign, Users } from "lucide-react";

const STATS = [
    { icon: TrendingUp, label: "Projected EPC", value: "$2.00–$2.40", sub: "Earnings per click" },
    { icon: ShoppingCart, label: "Conversion Rate", value: "3–5%", sub: "From VSL page" },
    { icon: DollarSign, label: "Avg Cart Value", value: "$65+", sub: "FE + all upsells" },
    { icon: RefreshCw, label: "Refund Rate", value: "<5%", sub: "30-day guarantee" },
    { icon: Star, label: "Launch Window", value: "7 Days", sub: "Days 1–3: $17 | 4–7: $27" },
    { icon: Users, label: "Target Market", value: "250M+", sub: "Creator economy worldwide" },
];

export function AffiliateStats() {
    return (
        <section className="py-16 border-b border-white/10">
            <div className="text-center mb-12">
                <p className="text-[#C6FF4E] text-xs font-black uppercase tracking-widest mb-3">By The Numbers</p>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Launch Stats & Projections</h2>
                <p className="text-white/50 mt-3 max-w-xl mx-auto">Based on internal testing with a cold audience. Warm list results will be significantly higher.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {STATS.map(({ icon: Icon, label, value, sub }) => (
                    <div key={label} className="p-6 rounded-2xl border border-white/10 bg-white/5 text-center hover:border-[#5C4EFA]/40 hover:bg-[#5C4EFA]/5 transition-all group">
                        <Icon className="h-6 w-6 text-[#5C4EFA] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <div className="text-3xl font-black text-white mb-1">{value}</div>
                        <div className="text-xs font-black text-white/60 uppercase tracking-wider">{label}</div>
                        <div className="text-[10px] text-white/30 mt-1">{sub}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
