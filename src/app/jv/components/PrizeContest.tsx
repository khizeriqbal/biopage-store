"use client";

import { Trophy, Medal, Star } from "lucide-react";

const PRIZES = [
    { rank: "1st Place", prize: "$500", icon: Trophy, color: "from-yellow-500 to-yellow-600", bg: "bg-yellow-500/10", badge: "text-yellow-400" },
    { rank: "2nd Place", prize: "$250", icon: Medal, color: "from-slate-400 to-slate-500", bg: "bg-slate-500/10", badge: "text-slate-300" },
    { rank: "3rd Place", prize: "$100", icon: Medal, color: "from-orange-500 to-orange-600", bg: "bg-orange-500/10", badge: "text-orange-400" },
    { rank: "4th Place", prize: "$50", icon: Star, color: "from-blue-500 to-blue-600", bg: "bg-blue-500/10", badge: "text-blue-400" },
    { rank: "5th Place", prize: "$50", icon: Star, color: "from-purple-500 to-purple-600", bg: "bg-purple-500/10", badge: "text-purple-400" },
];

export function PrizeContest() {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold text-white mb-2">💰 Prize Contest</h3>
                <p className="text-muted-foreground">
                    Top affiliates earn cash prizes based on performance during the launch period.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {PRIZES.map(({ rank, prize, icon: Icon, color, bg, badge }, idx) => (
                    <div
                        key={rank}
                        className={`relative rounded-xl border border-border/50 ${bg} p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-border/80`}
                    >
                        {idx === 0 && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full text-[10px] font-black uppercase tracking-wider text-white">
                                🏆 HOT
                            </div>
                        )}

                        <div className={`h-12 w-12 rounded-full ${bg} border border-border/50 flex items-center justify-center mx-auto mb-4`}>
                            <Icon className={`h-6 w-6 ${badge}`} />
                        </div>

                        <h4 className="text-sm font-bold text-white mb-1">{rank}</h4>
                        <div className={`text-3xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                            {prize}
                        </div>

                        {idx === 0 && (
                            <p className="text-[10px] text-yellow-400/60 mt-3 font-semibold uppercase tracking-wider">
                                Most Revenue
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <div className="rounded-xl border border-brand/30 bg-brand/5 p-6">
                <h4 className="font-bold text-white mb-3">How It Works</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                        <span className="text-brand font-bold">→</span>
                        <span>Prizes awarded to top 5 affiliates by total revenue generated</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-brand font-bold">→</span>
                        <span>Leaderboard updates daily throughout the promotion period</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-brand font-bold">→</span>
                        <span>Winners announced and paid via PayPal within 7 days of launch end</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-brand font-bold">→</span>
                        <span>Multiple affiliates can win in same position if revenue matches</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
