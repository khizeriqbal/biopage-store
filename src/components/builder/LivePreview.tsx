"use client";

import { cn } from "@/lib/utils";
import {
    Laptop,
    Smartphone,
    ExternalLink,
    ChevronRight,
    Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LivePreviewProps {
    settings: {
        avatar?: string;
        name?: string;
        bio?: string;
        theme: string;
        primaryColor: string;
        accentColor: string;
        layout: any[];
        socialLinks: any;
    };
}

export function LivePreview({ settings }: LivePreviewProps) {
    const [device, setDevice] = useState<"mobile" | "desktop">("mobile");

    return (
        <div className="flex flex-col h-full overflow-hidden bg-dark-bg/50 border-l border-border animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex h-14 items-center justify-between border-b border-border bg-surface px-4 shadow-sm z-10">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDevice("mobile")}
                        className={cn("h-8 w-8 rounded-lg", device === "mobile" ? "bg-brand/10 text-brand" : "text-muted-foreground")}
                    >
                        <Smartphone className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDevice("desktop")}
                        className={cn("h-8 w-8 rounded-lg", device === "desktop" ? "bg-brand/10 text-brand" : "text-muted-foreground")}
                    >
                        <Laptop className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest hidden md:inline">Live Preview</span>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-brand hover:bg-brand/10 group">
                        Open <ExternalLink className="h-3 w-3 ml-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-dark-bg">
                <div
                    className={cn(
                        "relative bg-background border border-border shadow-2xl transition-all duration-300 ease-in-out overflow-hidden h-fit",
                        device === "mobile" ? "w-[375px] rounded-[3rem] border-[8px] border-surface-raised min-h-[667px]" : "w-full max-w-4xl rounded-2xl min-h-[500px]"
                    )}
                >
                    {/* Scroll container inside "device" */}
                    <div className="h-full overflow-y-auto overflow-x-hidden pb-12">
                        {/* Bio Page Content Mockup */}
                        <div
                            className="h-32 w-full relative"
                            style={{
                                background: `linear-gradient(135deg, ${settings.primaryColor}33, ${settings.accentColor}33)`,
                                borderBottom: `1px solid ${settings.primaryColor}22`
                            }}
                        >
                            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                                <Avatar className="h-24 w-24 border-4 border-background shadow-xl scale-110">
                                    <AvatarImage src={settings.avatar} />
                                    <AvatarFallback className="bg-surface text-xl">{settings.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                            </div>
                        </div>

                        <div className="mt-16 px-6 text-center space-y-4">
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold tracking-tight text-white">{settings.name || "Your Name"}</h2>
                                <p className="text-sm text-muted-foreground max-w-[280px] mx-auto leading-relaxed">{settings.bio || "Sharing my thoughts and digital resources with the world."}</p>
                            </div>

                            <div className="flex items-center justify-center gap-3">
                                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-border bg-surface-raised/50">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                                <Button size="sm" className="rounded-full font-bold px-6 h-9" style={{ backgroundColor: settings.primaryColor, color: "white" }}>
                                    Subscribe
                                </Button>
                            </div>

                            <div className="pt-4 space-y-3">
                                {settings.layout.filter(l => l.enabled).map((block) => (
                                    <div
                                        key={block.id}
                                        className="p-4 rounded-2xl border border-border bg-surface-raised/40 text-left relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full opacity-50" style={{ backgroundColor: settings.primaryColor }} />
                                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1 opacity-70">
                                            {block.type} BLOCK
                                        </h4>
                                        <div className="flex items-center justify-between">
                                            <p className="text-[11px] text-muted-foreground font-medium">Coming soon on your public page.</p>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
