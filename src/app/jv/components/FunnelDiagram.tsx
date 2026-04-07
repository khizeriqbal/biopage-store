import { ArrowDown, DollarSign } from "lucide-react";

const FUNNEL = [
    {
        level: "FRONT END",
        name: "bio page.store Starter",
        desc: "All-in-one creator store with digital products, courses, bookings & AI tools",
        price: "$17",
        commission: "100% = $17",
        commColor: "text-[#C6FF4E]",
        bg: "bg-gradient-to-r from-[#5C4EFA]/20 to-[#5C4EFA]/10 border-[#5C4EFA]/40",
        badge: "bg-[#5C4EFA]",
    },
    {
        level: "OTO 1",
        name: "Creator Pro Upgrade",
        desc: "Remove platform fee, unlock AI suite, priority support & advanced analytics",
        price: "$37",
        commission: "50% = $18.50",
        commColor: "text-purple-300",
        bg: "bg-gradient-to-r from-purple-500/15 to-purple-500/5 border-purple-500/30",
        badge: "bg-purple-500",
    },
    {
        level: "OTO 2",
        name: "DFY Templates Vault",
        desc: "50 done-for-you product templates, bio templates & email swipe files",
        price: "$27",
        commission: "50% = $13.50",
        commColor: "text-blue-300",
        bg: "bg-gradient-to-r from-blue-500/15 to-blue-500/5 border-blue-500/30",
        badge: "bg-blue-500",
    },
    {
        level: "OTO 3",
        name: "Agency License",
        desc: "Manage up to 10 client stores, white-label dashboard & resell at any price",
        price: "$67",
        commission: "50% = $33.50",
        commColor: "text-orange-300",
        bg: "bg-gradient-to-r from-orange-500/15 to-orange-500/5 border-orange-500/30",
        badge: "bg-orange-500",
    },
    {
        level: "OTO 4",
        name: "Reseller Rights",
        desc: "Sell bio page.store as your own product & keep 100% of the profits forever",
        price: "$197",
        commission: "50% = $98.50",
        commColor: "text-[#C6FF4E]",
        bg: "bg-gradient-to-r from-[#C6FF4E]/15 to-[#C6FF4E]/5 border-[#C6FF4E]/30",
        badge: "bg-[#C6FF4E]",
    },
];

export function FunnelDiagram() {
    const totalMax = FUNNEL.reduce((s, f) => s + parseFloat(f.commission.replace(/[^0-9.]/g, "")), 0);

    return (
        <section className="py-16 border-b border-white/10">
            <div className="text-center mb-12">
                <p className="text-[#5C4EFA] text-xs font-black uppercase tracking-widest mb-3">The Funnel</p>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Your Complete Earnings Breakdown</h2>
                <p className="text-white/50 mt-3">If ONE buyer goes through the entire funnel, you earn up to <strong className="text-[#C6FF4E]">${totalMax.toFixed(2)}</strong> per customer</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-3">
                {FUNNEL.map((item, i) => (
                    <div key={i}>
                        <div className={`p-5 rounded-2xl border ${item.bg} flex items-center gap-4`}>
                            <div className={`${item.badge} text-black text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg shrink-0`}>
                                {item.level}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-black text-white text-sm">{item.name}</div>
                                <div className="text-xs text-white/50 mt-0.5 line-clamp-1">{item.desc}</div>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="text-white font-black">{item.price}</div>
                                <div className={`text-xs font-black ${item.commColor}`}>{item.commission}</div>
                            </div>
                        </div>
                        {i < FUNNEL.length - 1 && (
                            <div className="flex justify-center py-1">
                                <ArrowDown className="h-4 w-4 text-white/20" />
                            </div>
                        )}
                    </div>
                ))}

                {/* Total */}
                <div className="mt-6 p-5 rounded-2xl border border-[#C6FF4E]/40 bg-[#C6FF4E]/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <DollarSign className="h-6 w-6 text-[#C6FF4E]" />
                        <div>
                            <div className="font-black text-white">Maximum Earnings Per Customer</div>
                            <div className="text-xs text-white/50">If buyer takes every upsell</div>
                        </div>
                    </div>
                    <div className="text-3xl font-black text-[#C6FF4E]">${totalMax.toFixed(2)}</div>
                </div>
            </div>
        </section>
    );
}
