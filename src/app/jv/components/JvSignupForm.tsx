"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, User, MessageSquare, Users, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function JvSignupForm() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        skype: "",
        listSize: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/jv/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to sign up");

            toast.success("🎉 Welcome to the JV Partner Program!");
            setSubmitted(true);
            setFormData({ name: "", email: "", skype: "", listSize: "" });

            // Reset after 5 seconds
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err: any) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Application Received!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    We'll review your application and send you an email confirmation within 24 hours.
                </p>
                <p className="text-xs text-muted-foreground/60">
                    In the meantime, check out our email and social media swipes below 👇
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-border/50 bg-surface-raised/50 p-8 backdrop-blur-sm">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Join Our Partner Program</h3>
                <p className="text-sm text-muted-foreground">
                    Fill out the form below to apply for the JV Partner Program. We'll review your application and get back to you within 24 hours.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand/50" />
                        <Input
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="h-11 pl-11 bg-black/30 border-border/50 rounded-lg text-white placeholder:text-muted-foreground/40 focus:border-brand/50 focus:ring-brand/20"
                            required
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand/50" />
                        <Input
                            type="email"
                            placeholder="you@domain.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="h-11 pl-11 bg-black/30 border-border/50 rounded-lg text-white placeholder:text-muted-foreground/40 focus:border-brand/50 focus:ring-brand/20"
                            required
                        />
                    </div>
                </div>

                {/* Skype */}
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Skype Handle</Label>
                    <div className="relative">
                        <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand/50" />
                        <Input
                            type="text"
                            placeholder="your.skype.username"
                            value={formData.skype}
                            onChange={(e) => setFormData({ ...formData, skype: e.target.value })}
                            className="h-11 pl-11 bg-black/30 border-border/50 rounded-lg text-white placeholder:text-muted-foreground/40 focus:border-brand/50 focus:ring-brand/20"
                            required
                        />
                    </div>
                </div>

                {/* List Size */}
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email List Size</Label>
                    <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand/50" />
                        <Input
                            type="text"
                            placeholder="e.g., 10,000+"
                            value={formData.listSize}
                            onChange={(e) => setFormData({ ...formData, listSize: e.target.value })}
                            className="h-11 pl-11 bg-black/30 border-border/50 rounded-lg text-white placeholder:text-muted-foreground/40 focus:border-brand/50 focus:ring-brand/20"
                            required
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading || !formData.name || !formData.email || !formData.skype || !formData.listSize}
                    className="w-full h-11 font-bold uppercase tracking-wider text-sm bg-accent text-black hover:bg-accent/90 rounded-lg transition-all duration-300 active:scale-[0.98]"
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        "Apply Now"
                    )}
                </Button>

                <p className="text-[10px] text-muted-foreground/50 text-center">
                    We'll never spam you. Just partner opportunities and program updates.
                </p>
            </form>
        </div>
    );
}
