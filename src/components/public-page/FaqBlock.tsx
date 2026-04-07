"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqBlockProps {
    items: FaqItem[];
    settings: { primaryColor: string; accentColor: string };
}

export function FaqBlock({ items, settings }: FaqBlockProps) {
    const [openIdx, setOpenIdx] = useState<number | null>(null);

    return (
        <div className="space-y-3">
            <h4 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h4>
            {items.map((item, i) => (
                <div
                    key={i}
                    className={cn(
                        "border border-border rounded-2xl overflow-hidden transition-all",
                        openIdx === i ? "border-brand/30 bg-surface-raised/60" : "bg-surface-raised/20 hover:bg-surface-raised/40"
                    )}
                >
                    <button
                        onClick={() => setOpenIdx(openIdx === i ? null : i)}
                        className="w-full flex items-center justify-between p-5 text-left"
                    >
                        <span className="font-semibold text-white pr-4">{item.question}</span>
                        <ChevronDown
                            className={cn(
                                "h-4 w-4 text-muted-foreground transition-transform shrink-0",
                                openIdx === i && "rotate-180"
                            )}
                        />
                    </button>
                    {openIdx === i && (
                        <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed animate-in fade-in duration-200">
                            {item.answer}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
