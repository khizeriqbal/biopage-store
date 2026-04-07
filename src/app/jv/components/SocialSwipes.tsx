"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2, Facebook, Twitter, Instagram } from "lucide-react";
import { toast } from "sonner";

const SOCIAL_SWIPES = [
    {
        platform: "Facebook",
        icon: Facebook,
        color: "text-blue-600",
        copies: [
            "Just found this... bio page.store is honestly a game changer for creators. Sold $4k in my first week 🤯 [LINK]",
            "No more juggling 5 different tools. This does everything - storefronts, email sequences, affiliate programs. Game over 🎯 [LINK]",
            "If you're a creator and not using bio page.store, you're literally leaving money on the table. The free trial is insane [LINK]",
        ],
    },
    {
        platform: "Twitter/X",
        icon: Twitter,
        color: "text-black",
        copies: [
            "just launched with bio page.store. made $4,200 in week 1. the conversion rate is insane. 💰",
            "creator economy in 2024: you need a storefront, email sequences, affiliate program management, and analytics. bio page.store = all of it.",
            "the new standard for creator monetization is here and it's called bio page.store. 30-day free trial 👀",
        ],
    },
    {
        platform: "Instagram",
        icon: Instagram,
        color: "text-pink-500",
        copies: [
            "Finally a tool built for creators, not for agencies 📱 bio page.store is changing how we make money online 🚀 #CreatorEconomy",
            "Sold $4k worth of digital products in ONE WEEK using bio page.store ✨ The conversion rate is unreal 💰 [LINK in bio]",
            "No more saying 'my course isn't selling' - it's your sales page 👋 bio page.store fixes that 🎯 #CreatorTools",
        ],
    },
];

export function SocialSwipes() {
    const [copiedIdx, setCopiedIdx] = useState<string | null>(null);

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(key);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold text-white mb-2">📱 Social Media Swipes</h3>
                <p className="text-muted-foreground">
                    Ready-to-post content for Facebook, Twitter/X, and Instagram. Customize and share!
                </p>
            </div>

            <div className="space-y-8">
                {SOCIAL_SWIPES.map(({ platform, icon: Icon, color, copies }) => (
                    <div key={platform} className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Icon className={`h-5 w-5 ${color}`} />
                            <h4 className="text-lg font-bold text-white">{platform}</h4>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {copies.map((copy, idx) => (
                                <div key={idx} className="rounded-lg border border-border/50 bg-black/30 p-4">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <p className="text-sm text-white/80 flex-1 break-words">{copy}</p>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => copyToClipboard(copy, `${platform}-${idx}`)}
                                            className="shrink-0 h-8 w-8 p-0 hover:bg-white/10"
                                        >
                                            {copiedIdx === `${platform}-${idx}` ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-400" />
                                            ) : (
                                                <Copy className="h-4 w-4 text-muted-foreground/60" />
                                            )}
                                        </Button>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground/50">Post #{idx + 1}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-xl border border-brand/30 bg-brand/5 p-6">
                <h4 className="font-bold text-white mb-3">Posting Strategy</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Post 1-2x per week on each platform</li>
                    <li>• Space out posts so they don't look spammy</li>
                    <li>• Engage with comments - respond quickly</li>
                    <li>• Track which platforms drive the most clicks (use bit.ly or short.link)</li>
                    <li>• Mix promotional posts with value/educational content</li>
                </ul>
            </div>
        </div>
    );
}
