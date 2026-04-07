"use client";

import { useEffect, useState } from "react";

interface CountdownBlockProps {
    date: string;
    title?: string;
    settings: { primaryColor: string; accentColor: string };
}

function pad(n: number) {
    return String(n).padStart(2, "0");
}

export function CountdownBlock({ date, title, settings }: CountdownBlockProps) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        const target = new Date(date).getTime();

        const tick = () => {
            const now = Date.now();
            const diff = target - now;

            if (diff <= 0) {
                setExpired(true);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft({ days, hours, minutes, seconds });
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [date]);

    if (expired) return null;

    return (
        <div className="p-8 border border-border bg-surface-raised/40 rounded-3xl text-center space-y-6">
            {title && (
                <h4 className="text-xl font-bold text-white">{title}</h4>
            )}
            <div className="flex items-center justify-center gap-4">
                {[
                    { label: "Days", value: timeLeft.days },
                    { label: "Hours", value: timeLeft.hours },
                    { label: "Minutes", value: timeLeft.minutes },
                    { label: "Seconds", value: timeLeft.seconds },
                ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                        <div
                            className="h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white border border-border"
                            style={{ backgroundColor: `${settings.primaryColor}20` }}
                        >
                            {pad(value)}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
