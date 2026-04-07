"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Zap, DollarSign, TrendingUp } from "lucide-react";

function Countdown({ target }: { target: string }) {
    const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

    useEffect(() => {
        const tick = () => {
            const diff = new Date(target).getTime() - Date.now();
            if (diff <= 0) return;
            setTime({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [target]);

    return (
        <div className="flex items-center justify-center gap-3 my-6">
            {[{ v: time.d, l: "Days" }, { v: time.h, l: "Hrs" }, { v: time.m, l: "Min" }, { v: time.s, l: "Sec" }].map(({ v, l }) => (
                <div key={l} className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#5C4EFA]/20 border border-[#5C4EFA]/40 rounded-xl flex items-center justify-center text-2xl font-black text-white tabular-nums">
                        {String(v).padStart(2, "0")}
                    </div>
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">{l}</span>
                </div>
            ))}
        </div>
    );
}

export function JvHero({ launchDate, warriorplusLink, jvzooLink }: { launchDate: string; warriorplusLink: string; jvzooLink: string }) {
    return (
        <section className="py-16 text-center space-y-6 border-b border-white/10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C6FF4E]/30 bg-[#C6FF4E]/10 text-[#C6FF4E] text-xs font-black uppercase tracking-widest">
                <Zap className="h-3 w-3" /> Exclusive JV Partner Invitation — Limited Spots
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-tight max-w-4xl mx-auto">
                Finally — A Creator Store Platform That{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5C4EFA] to-[#C6FF4E]">
                    PAYS Affiliates 100%
                </span>{" "}
                On The Front End
            </h1>

            <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                Promote <strong className="text-white">bio page.store</strong> and earn <strong className="text-[#C6FF4E]">$17 per sale (100% commission)</strong> + 50% on 4 high-converting upsells. Average cart value <strong className="text-white">$65+</strong>.
            </p>

            {/* Commission pills */}
            <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                    { icon: DollarSign, label: "100% FE Commission", color: "text-[#C6FF4E]", bg: "bg-[#C6FF4E]/10 border-[#C6FF4E]/30" },
                    { icon: TrendingUp, label: "$2.00+ EPC Tested", color: "text-[#5C4EFA]", bg: "bg-[#5C4EFA]/10 border-[#5C4EFA]/30" },
                    { icon: Zap, label: "$65+ Avg Cart Value", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30" },
                ].map(({ icon: Icon, label, color, bg }) => (
                    <div key={label} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${bg} ${color}`}>
                        <Icon className="h-4 w-4" /> {label}
                    </div>
                ))}
            </div>

            {/* Countdown */}
            <div>
                <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-2">Launch Opens In</p>
                <Countdown target={launchDate} />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <a href={warriorplusLink} target="_blank" rel="noopener noreferrer">
                    <Button className="h-14 px-8 bg-[#FF6B00] hover:bg-[#e05f00] text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-orange-500/20 rounded-xl gap-2 transition-all active:scale-95">
                        <ExternalLink className="h-4 w-4" /> Get Affiliate Link on WarriorPlus
                    </Button>
                </a>
                <a href={jvzooLink} target="_blank" rel="noopener noreferrer">
                    <Button className="h-14 px-8 bg-[#1a7a4a] hover:bg-[#15633c] text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-green-500/20 rounded-xl gap-2 transition-all active:scale-95">
                        <ExternalLink className="h-4 w-4" /> Get Affiliate Link on JVZoo
                    </Button>
                </a>
            </div>
            <p className="text-xs text-white/30">⬇ Scroll down for email swipes, banners, and all promo materials ⬇</p>
        </section>
    );
}
