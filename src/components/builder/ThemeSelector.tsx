"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const themes = [
    { id: "midnight", label: "Midnight", primary: "#5C4EFA", accent: "#C6FF4E", bg: "#0D0D14" },
    { id: "aurora", label: "Aurora", primary: "#00D1FF", accent: "#FF00FF", bg: "#0F172A" },
    { id: "ember", label: "Ember", primary: "#FF4D00", accent: "#FFD700", bg: "#1A0F0D" },
    { id: "ocean", label: "Ocean", primary: "#0EA5E9", accent: "#34D399", bg: "#020617" },
    { id: "forest", label: "Forest", primary: "#10B981", accent: "#FDE047", bg: "#064E3B" },
    { id: "rose", label: "Rose", primary: "#F43F5E", accent: "#FDA4AF", bg: "#1E1B4B" },
    { id: "ivory", label: "Ivory", primary: "#27272A", accent: "#71717A", bg: "#FAFAFA" },
    { id: "slate", label: "Slate", primary: "#334155", accent: "#94A3B8", bg: "#F8FAFC" },
    { id: "neon", label: "Neon", primary: "#FF00FF", accent: "#00FFFF", bg: "#000000" },
    { id: "minimal", label: "Minimal", primary: "#000000", accent: "#E5E7EB", bg: "#FFFFFF" },
    { id: "vintage", label: "Vintage", primary: "#78350F", accent: "#FEF3C7", bg: "#FEFCE8" },
    { id: "cosmic", label: "Cosmic", primary: "#8B5CF6", accent: "#F472B6", bg: "#1E1B4B" },
];

export function ThemeSelector({
    selected,
    onSelect
}: {
    selected: string;
    onSelect: (id: string) => void
}) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {themes.map((theme) => (
                <button
                    key={theme.id}
                    onClick={() => onSelect(theme.id)}
                    className={cn(
                        "group relative flex flex-col items-center gap-2 rounded-xl border border-border bg-surface-raised p-2 transition-all hover:bg-surface-hover hover:border-brand/40 shadow-xl",
                        selected === theme.id && "border-brand bg-brand/5 ring-1 ring-brand/50 shadow-brand/10"
                    )}
                >
                    <div
                        className="aspect-video w-full rounded-lg overflow-hidden flex flex-col gap-1 p-2"
                        style={{ backgroundColor: theme.bg }}
                    >
                        <div className="h-2 w-1/2 rounded-full" style={{ backgroundColor: theme.primary }} />
                        <div className="h-1.5 w-1/3 rounded-full opacity-50" style={{ backgroundColor: theme.accent }} />
                        <div className="mt-auto h-3 w-1/4 rounded-sm" style={{ backgroundColor: theme.accent }} />
                    </div>
                    <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-colors",
                        selected === theme.id && "text-brand"
                    )}>
                        {theme.label}
                    </span>
                    {selected === theme.id && (
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-brand flex items-center justify-center">
                            <Check className="h-2.5 w-2.5 text-white" />
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}
