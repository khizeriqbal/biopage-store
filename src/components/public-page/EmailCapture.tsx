"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EmailCaptureProps {
    user: {
        name: string | null;
    };
    settings: {
        primaryColor: string;
        accentColor: string;
    };
    leadMagnet?: {
        title: string;
        id: string;
    };
}

export function EmailCapture({ user, settings, leadMagnet }: EmailCaptureProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/subscribers", {
                method: "POST",
                body: JSON.stringify({ email, productId: leadMagnet?.id }),
            });

            if (res.ok) {
                setDone(true);
                toast.success("Welcome aboard! 📨");
            } else {
                toast.error("An error occurred");
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (done) {
        return (
            <div className="w-full text-center p-8 border-2 border-accent/20 bg-accent/5 rounded-2xl flex flex-col items-center gap-4 animate-in zoom-in duration-500">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-xl font-bold text-white tracking-tight">You're in! ✨</h4>
                    <p className="text-sm text-muted-foreground">Thanks for subscribing. Check your inbox for updates.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full border border-border bg-surface-raised/40 backdrop-blur-md p-8 md:p-12 rounded-3xl space-y-8 flex flex-col items-center text-center group">
            <div className="space-y-3 max-w-sm">
                <div className="h-12 w-12 rounded-full bg-brand/10 flex items-center justify-center text-brand mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight leading-tight sm:text-3xl">
                    {leadMagnet ? `Get my ${leadMagnet.title} for free` : `Join ${user.name || "my"}'s newsletter`}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    Join {leadMagnet ? "to claim your resource and" : "to"} get exclusive updates, strategy, and more sent to your inbox.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                <div className="relative flex-1 group/field">
                    <span className="absolute left-3 top-3 text-muted-foreground opacity-30 h-4 w-4">
                        <Mail className="h-4 w-4" />
                    </span>
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="bg-surface-raised border-border h-12 pl-10 focus:ring-accent w-full font-medium"
                    />
                </div>
                <Button
                    onClick={handleSubscribe}
                    disabled={loading || !email}
                    className="h-12 rounded-xl font-bold uppercase tracking-wider shadow-lg active:scale-95 px-8"
                    style={{ backgroundColor: settings.primaryColor, color: "white" }}
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                    Subscribe
                </Button>
            </div>
        </div>
    );
}

const ChevronRight = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);
