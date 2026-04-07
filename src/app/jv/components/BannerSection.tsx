"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2, Download } from "lucide-react";
import { toast } from "sonner";

const BANNERS = [
    {
        name: "Leaderboard (728x90)",
        width: 728,
        height: 90,
        bgGradient: "from-brand to-accent",
        content: (
            <div className="flex items-center justify-center h-full gap-2 px-3">
                <span className="text-white font-black text-xs">🚀 BIO PAGE STORE</span>
                <span className="text-white/60 text-[10px]">•</span>
                <span className="text-white/80 text-[10px]">Earn 50% Commission</span>
                <span className="text-white/60 text-[10px]">•</span>
                <span className="bg-accent text-black px-2 py-0.5 rounded text-[10px] font-bold">JOIN NOW</span>
            </div>
        ),
    },
    {
        name: "Medium Rectangle (300x250)",
        width: 300,
        height: 250,
        bgGradient: "from-brand via-purple-600 to-accent",
        content: (
            <div className="flex flex-col items-center justify-center h-full px-4 text-center gap-3">
                <div className="text-3xl">🚀</div>
                <div>
                    <h4 className="text-white font-black text-sm leading-tight">
                        Earn 50%<br />Commission
                    </h4>
                    <p className="text-white/60 text-[10px] mt-1">Creator Storefront</p>
                </div>
                <button className="bg-accent text-black px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-wider">
                    Promote Now
                </button>
                <p className="text-[9px] text-white/40">Limited time launch offer</p>
            </div>
        ),
    },
    {
        name: "Wide Skyscraper (160x600)",
        width: 160,
        height: 600,
        bgGradient: "from-brand to-accent",
        content: (
            <div className="flex flex-col items-center justify-center h-full px-3 text-center gap-2">
                <div className="text-2xl">💰</div>
                <h4 className="text-white font-black text-[11px] leading-tight">
                    BIO PAGE<br />STORE
                </h4>
                <p className="text-white/60 text-[8px]">50% Affiliate<br />Commission</p>
                <div className="w-full h-px bg-white/20 my-1" />
                <button className="bg-accent text-black px-2 py-1 rounded text-[8px] font-black uppercase tracking-wider w-full">
                    Join
                </button>
                <p className="text-[8px] text-white/30">Launch Special</p>
            </div>
        ),
    },
];

export function BannerSection() {
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

    const copyBannerCode = (banner: typeof BANNERS[0], idx: number) => {
        const code = `<a href="YOUR_AFFILIATE_LINK" target="_blank" rel="noopener noreferrer">
  <img src="https://biopage.store/banners/banner-${idx + 1}.jpg" width="${banner.width}" height="${banner.height}" alt="Bio Page Store Affiliate" />
</a>`;
        navigator.clipboard.writeText(code);
        setCopiedIdx(idx);
        toast.success("Banner code copied!");
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold text-white mb-2">🎨 Banner Ads</h3>
                <p className="text-muted-foreground">
                    Download these banners and place them on your blog, website, or newsletter to earn commissions.
                </p>
            </div>

            <div className="space-y-8">
                {BANNERS.map((banner, idx) => (
                    <div key={idx} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-lg font-bold text-white">{banner.name}</h4>
                                <p className="text-sm text-muted-foreground/60">{banner.width}x{banner.height}px</p>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyBannerCode(banner, idx)}
                                className="border-border/50 text-xs"
                            >
                                {copiedIdx === idx ? (
                                    <>
                                        <CheckCircle2 className="h-3 w-3 text-green-400 mr-1" />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-3 w-3 mr-1" />
                                        Copy Code
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Banner Preview */}
                        <div className={`rounded-lg border border-border/50 overflow-hidden shadow-lg bg-gradient-to-r ${banner.bgGradient}`} style={{ width: `${Math.min(banner.width, 100)}%`, maxWidth: `${banner.width}px`, aspectRatio: `${banner.width} / ${banner.height}` }}>
                            {banner.content}
                        </div>

                        <p className="text-[10px] text-muted-foreground/50">
                            💡 Replace YOUR_AFFILIATE_LINK with your unique tracking link from the affiliate dashboard
                        </p>
                    </div>
                ))}
            </div>

            <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
                <h4 className="font-bold text-white mb-3">How to Use Banners</h4>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Copy the banner code above</li>
                    <li>Paste it into your website/blog sidebar or footer</li>
                    <li>Make sure to replace YOUR_AFFILIATE_LINK with your unique tracking URL</li>
                    <li>Track clicks and conversions in your affiliate dashboard</li>
                    <li>A/B test different banner sizes to see which performs best</li>
                </ol>
            </div>
        </div>
    );
}
