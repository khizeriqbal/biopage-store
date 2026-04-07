"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Globe, CheckCircle2, XCircle, Copy, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CustomDomainCardProps {
    currentDomain: string | null;
    domainVerified: boolean;
    plan: string;
}

const CNAME_TARGET = "cname.biopage.store";

export function CustomDomainCard({ currentDomain, domainVerified, plan }: CustomDomainCardProps) {
    const [domain, setDomain] = useState(currentDomain || "");
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [saved, setSaved] = useState(!!currentDomain);
    const [verified, setVerified] = useState(domainVerified);

    const isPaidPlan = plan !== "FREE";

    const handleSave = async () => {
        if (!domain) return;
        setLoading(true);
        try {
            const res = await fetch("/api/domain", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ domain }),
            });
            const data = await res.json();
            if (res.ok) {
                setSaved(true);
                setVerified(false);
                toast.success("Domain saved! Add the CNAME record below.");
            } else {
                toast.error(data.error || "Failed to save domain");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        setVerifying(true);
        try {
            const res = await fetch("/api/domain/verify", { method: "POST" });
            const data = await res.json();
            if (data.verified) {
                setVerified(true);
                toast.success("Domain verified! Your custom domain is active.");
            } else {
                toast.error(data.message || "Verification failed");
            }
        } finally {
            setVerifying(false);
        }
    };

    const handleRemove = async () => {
        await fetch("/api/domain", { method: "DELETE" });
        setDomain("");
        setSaved(false);
        setVerified(false);
        toast.success("Custom domain removed");
    };

    return (
        <div className="p-8 rounded-3xl border border-border bg-surface-raised/40 space-y-6 backdrop-blur-md">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Globe className="h-4 w-4" />
                </div>
                <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] leading-none">Custom Domain</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Use your own domain instead of biopage.store/username</p>
                </div>
            </div>

            {!isPaidPlan ? (
                <div className="p-4 rounded-xl border border-border bg-surface/50 text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Custom domains require a <strong className="text-white">STARTER</strong> plan or above.</p>
                    <Button size="sm" className="bg-brand text-white hover:bg-brand/90 font-bold mt-2">
                        Upgrade Plan
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="flex-1 space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Your Domain</Label>
                            <Input
                                value={domain}
                                onChange={e => { setDomain(e.target.value); setSaved(false); }}
                                placeholder="shop.yourdomain.com"
                                className="bg-surface-raised border-border text-white h-11"
                                disabled={saved && verified}
                            />
                        </div>
                        {saved && !verified ? (
                            <div className="flex flex-col justify-end gap-2">
                                <Button
                                    onClick={handleVerify}
                                    disabled={verifying}
                                    className="h-11 bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 font-bold"
                                    variant="outline"
                                >
                                    {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify DNS"}
                                </Button>
                            </div>
                        ) : !saved ? (
                            <div className="flex flex-col justify-end">
                                <Button
                                    onClick={handleSave}
                                    disabled={loading || !domain}
                                    className="h-11 bg-brand text-white hover:bg-brand/90 font-bold"
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                                </Button>
                            </div>
                        ) : null}
                    </div>

                    {/* Status badge */}
                    {saved && (
                        <div className="flex items-center gap-2">
                            {verified ? (
                                <Badge className="bg-green-500/20 text-green-400 border-none gap-1">
                                    <CheckCircle2 className="h-3 w-3" /> Domain Active
                                </Badge>
                            ) : (
                                <Badge className="bg-yellow-500/20 text-yellow-400 border-none gap-1">
                                    <XCircle className="h-3 w-3" /> Pending Verification
                                </Badge>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleRemove}
                                className="text-muted-foreground hover:text-red-400 text-xs gap-1 h-6"
                            >
                                <Trash2 className="h-3 w-3" /> Remove
                            </Button>
                        </div>
                    )}

                    {/* DNS instructions */}
                    {saved && !verified && (
                        <div className="p-4 rounded-xl border border-border bg-surface/50 space-y-3">
                            <p className="text-xs font-bold text-white uppercase tracking-wider">DNS Setup Required</p>
                            <p className="text-xs text-muted-foreground">Add this CNAME record in your domain registrar (Cloudflare, GoDaddy, Namecheap, etc.):</p>
                            <div className="rounded-lg bg-dark-bg border border-border p-3 font-mono text-xs space-y-2">
                                <div className="grid grid-cols-3 gap-2 text-muted-foreground/60 text-[10px] uppercase tracking-wider pb-1 border-b border-border">
                                    <span>Type</span>
                                    <span>Name</span>
                                    <span>Value</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-white">
                                    <span className="text-brand font-bold">CNAME</span>
                                    <span>{domain.split(".")[0]}</span>
                                    <div className="flex items-center gap-1">
                                        <span className="truncate">{CNAME_TARGET}</span>
                                        <button
                                            onClick={() => { navigator.clipboard.writeText(CNAME_TARGET); toast.success("Copied!"); }}
                                            className="text-muted-foreground hover:text-white shrink-0"
                                        >
                                            <Copy className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[10px] text-muted-foreground opacity-70">DNS changes can take up to 48 hours to propagate.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
