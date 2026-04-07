"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, ExternalLink } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Using a placeholder icon or Whop's logo if imported. 
// For now, replacing CreditCard with a generic store icon
import { Store } from "lucide-react";

interface WhopConnectCardProps {
    connected: boolean;
    onboarded: boolean;
}

export function WhopConnectCard({ connected, onboarded }: WhopConnectCardProps) {
    const [loading, setLoading] = useState(false);

    const handleConnect = () => {
        setLoading(true);
        window.location.href = "/api/whop/connect";
    };

    return (
        <Card className="border-border bg-surface-raised/40 backdrop-blur-md overflow-hidden relative group">
            {!connected && (
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 animate-pulse" />
            )}
            {connected && onboarded && (
                <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
            )}

            <CardHeader className="p-8 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-xl group-hover:scale-110 transition-transform">
                        <Store className="h-6 w-6" />
                    </div>
                    {connected && onboarded ? (
                        <Badge className="bg-accent/20 text-accent border border-accent/30 font-bold uppercase tracking-widest text-[10px] py-0 px-3 h-6 flex items-center gap-1.5 shadow-lg shadow-accent/5 leading-none">
                            <CheckCircle2 className="h-3 w-3" /> Fully Setup
                        </Badge>
                    ) : (
                        <Badge className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 font-bold uppercase tracking-widest text-[10px] py-0 px-3 h-6 flex items-center gap-1.5 shadow-lg shadow-yellow-500/5 leading-none">
                            <AlertCircle className="h-3 w-3" /> Action Required
                        </Badge>
                    )}
                </div>
                <CardTitle className="text-2xl font-bold text-white tracking-tight">Whop Payouts</CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed mt-1">
                    {connected && onboarded
                        ? "Your payments are managed through Whop. Earnings are sent direct to your connected account payout method."
                        : "Connect your Whop account to start accepting payments and receiving payouts for your products."}
                </CardDescription>
            </CardHeader>

            <CardContent className="p-8 pt-0 flex flex-col gap-6">
                {connected && onboarded ? (
                    <div className="space-y-4">
                        <div className="p-5 rounded-xl bg-surface/50 border border-border flex items-center justify-between gap-4">
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Whop Account Status</p>
                                <p className="text-sm font-semibold text-white">Company Connected</p>
                            </div>
                            <Button
                                variant="outline"
                                className="h-9 text-xs border-border bg-surface-raised/50 hover:bg-surface-hover hover:text-white"
                                onClick={() => window.open('https://dash.whop.com', '_blank', 'noopener,noreferrer')}
                            >
                                Go to Whop <ExternalLink className="h-3.5 w-3.5 ml-2 opacity-40" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Button
                        onClick={handleConnect}
                        disabled={loading}
                        className="w-full bg-[#FF6243] text-white hover:bg-[#E5583C] font-bold h-12 shadow-xl shadow-orange-500/20 active:scale-95 transition-all group/btn"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Store className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform" />}
                        Connect Whop Account <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
