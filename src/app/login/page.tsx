"use client";

import { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/Logo";
import {
    Mail, Lock, Loader2, ArrowRight, Sparkles,
    CheckCircle2, Eye, EyeOff, User, ShieldCheck,
    Zap, Star, TrendingUp, Users
} from "lucide-react";
import { Chrome } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

const FEATURES = [
    { icon: Zap, text: "Sell digital products in minutes" },
    { icon: TrendingUp, text: "Built-in analytics & revenue tracking" },
    { icon: Users, text: "Affiliate & referral marketing tools" },
    { icon: Star, text: "AI-powered bio & product descriptions" },
];

const SOCIAL_PROOF = [
    { initials: "AK", name: "Alex K.", revenue: "$12,400" },
    { initials: "SM", name: "Sara M.", revenue: "$8,900" },
    { initials: "JR", name: "James R.", revenue: "$21,000" },
];

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"login" | "register">("login");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "error">("idle");
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Clear status if username is too short
        if (username.length < 3) {
            setUsernameStatus("idle");
            return;
        }

        // Show checking state
        setUsernameStatus("checking");

        // Clear any pending timeout
        if (debounceRef.current) clearTimeout(debounceRef.current);

        // Debounce the check
        debounceRef.current = setTimeout(async () => {
            try {
                const response = await fetch(
                    `/api/user/check-username?username=${encodeURIComponent(username)}`,
                    { cache: 'no-store' }
                );

                if (!response.ok) {
                    console.warn("Username check returned status:", response.status);
                    setUsernameStatus("idle"); // Assume available if check fails
                    return;
                }

                const data = await response.json();

                // Explicitly check the boolean value
                if (data.available === true) {
                    setUsernameStatus("available");
                } else if (data.available === false) {
                    setUsernameStatus("taken");
                } else {
                    // If response is unclear, default to idle (let signup handle it)
                    console.warn("Unclear availability response:", data);
                    setUsernameStatus("idle");
                }
            } catch (error) {
                console.error("Username check fetch error:", error);
                // On fetch error, don't block user from trying
                setUsernameStatus("idle");
            }
        }, 500);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [username]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === "register") {
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password, username, name }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to create account");
                toast.success("Account created! Signing you in...");
            }

            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl: "/dashboard",
            });

            // NextAuth v5 returns object with ok/error properties
            if (res?.error || !res?.ok) {
                toast.error(res?.error || "Incorrect email or password. Please try again.");
            } else {
                toast.success(mode === "register" ? "Welcome to bio page.store! 🎉" : "Welcome back!");
                const redirectUrl = res.url || "/dashboard";
                router.push(redirectUrl);
                router.refresh();
            }
        } catch (err: any) {
            // NextAuth v5 throws on auth errors in some configurations
            if (err?.message?.includes("CredentialsSignin") || err?.type === "CredentialsSignin") {
                toast.error("Incorrect email or password. Please try again.");
            } else {
                toast.error(err.message || "Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    const isLoginValid = email && password;
    const isRegisterValid =
        email && password && password.length >= 6 &&
        username && username.length >= 3 &&
        usernameStatus === "available";

    return (
        <div className="min-h-screen bg-dark-bg flex selection:bg-brand selection:text-white">

            {/* ── LEFT PANEL (hidden on mobile) ── */}
            <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12 bg-gradient-to-br from-[#0d0d14] via-[#0f0f1a] to-dark-bg border-r border-border">
                {/* Glow blobs */}
                <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-brand/20 rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                    backgroundSize: "60px 60px"
                }} />

                {/* Top: Logo */}
                <div className="relative z-10">
                    <Logo />
                </div>

                {/* Middle: Hero text */}
                <div className="relative z-10 space-y-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand/30 bg-brand/10">
                            <Sparkles className="h-3 w-3 text-brand" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand">Your Creator Store</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter leading-[1.05]">
                            Sell anything.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-purple-400 to-accent">
                                Build everything.
                            </span>
                        </h1>
                        <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
                            The all-in-one creator storefront with payments, affiliates, email automation, and AI — all in one link.
                        </p>
                    </div>

                    {/* Feature list */}
                    <div className="space-y-3">
                        {FEATURES.map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
                                    <Icon className="h-4 w-4 text-brand" />
                                </div>
                                <span className="text-sm text-white/80 font-medium">{text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Social proof */}
                    <div className="p-5 rounded-2xl border border-border/50 bg-surface-raised/30 backdrop-blur-sm space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Creators earning this month</p>
                        <div className="space-y-3">
                            {SOCIAL_PROOF.map(({ initials, name, revenue }) => (
                                <div key={name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-xs font-black text-brand">
                                            {initials}
                                        </div>
                                        <span className="text-sm font-semibold text-white">{name}</span>
                                    </div>
                                    <span className="text-sm font-black text-accent">{revenue}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom: Security badge */}
                <div className="relative z-10 flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        Bank-grade encryption · Whop-powered payments
                    </span>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative overflow-hidden">
                {/* Mobile glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-brand/8 rounded-full blur-[100px] pointer-events-none lg:hidden" />

                <div className="w-full max-w-[420px] relative z-10">

                    {/* Mobile logo */}
                    <div className="flex justify-center mb-8 lg:hidden">
                        <Logo />
                    </div>

                    {/* Header */}
                    <div className="mb-8 space-y-1">
                        <h2 className="text-3xl font-black text-white tracking-tight">
                            {mode === "login" ? "Welcome back" : "Create your store"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {mode === "login"
                                ? "Sign in to access your creator dashboard"
                                : "Free to start — no credit card required"}
                        </p>
                    </div>

                    {/* Mode toggle */}
                    <div className="flex p-1 rounded-2xl bg-surface-raised/50 border border-border/50 mb-8">
                        {(["login", "register"] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => { setMode(m); setEmail(""); setPassword(""); setUsername(""); setName(""); }}
                                className={cn(
                                    "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                                    mode === m
                                        ? "bg-brand text-white shadow-lg shadow-brand/20"
                                        : "text-muted-foreground hover:text-white"
                                )}
                            >
                                {m === "login" ? "Sign In" : "Sign Up"}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {mode === "register" && (
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 z-10" />
                                    <Input
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="h-12 pl-11 bg-surface-raised/60 border-border/60 rounded-xl text-white font-medium focus:border-brand/50 focus:ring-brand/20 transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 z-10" />
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder={mode === "login" ? "test@biopage.store" : "you@domain.com"}
                                    className="h-12 pl-11 bg-surface-raised/60 border-border/60 rounded-xl text-white font-medium focus:border-brand/50 focus:ring-brand/20 transition-all"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {mode === "register" && (
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Username</Label>
                                    {usernameStatus !== "idle" && (
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-wider",
                                            usernameStatus === "available" ? "text-green-400" :
                                                usernameStatus === "taken" ? "text-red-400" :
                                                    usernameStatus === "checking" ? "text-muted-foreground" : "text-yellow-400"
                                        )}>
                                            {usernameStatus === "available" ? "✓ Available" :
                                                usernameStatus === "taken" ? "✗ Taken" :
                                                    usernameStatus === "checking" ? "Checking..." : "Check failed"}
                                        </span>
                                    )}
                                </div>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-sm font-bold z-10">@</span>
                                    <Input
                                        value={username}
                                        onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                                        placeholder="myusername"
                                        className={cn(
                                            "h-12 pl-9 bg-surface-raised/60 border-border/60 rounded-xl text-white font-medium transition-all",
                                            usernameStatus === "available" && "border-green-500/40 focus:border-green-500/60",
                                            usernameStatus === "taken" && "border-red-500/40 focus:border-red-500/60"
                                        )}
                                    />
                                    {usernameStatus === "checking" && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand animate-spin" />}
                                    {usernameStatus === "available" && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-green-400" />}
                                </div>
                                <p className="text-[10px] text-muted-foreground/60 ml-1">biopage.store/{username || "yourname"}</p>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</Label>
                                {mode === "register" && password.length > 0 && (
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-wider",
                                        password.length < 6 ? "text-red-400" : password.length < 10 ? "text-yellow-400" : "text-green-400"
                                    )}>
                                        {password.length < 6 ? "Too short" : password.length < 10 ? "Good" : "Strong"}
                                    </span>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 z-10" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder={mode === "login" ? "Test1234!" : "Min. 6 characters"}
                                    className="h-12 pl-11 pr-12 bg-surface-raised/60 border-border/60 rounded-xl text-white font-medium focus:border-brand/50 focus:ring-brand/20 transition-all"
                                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(s => !s)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Password strength bar (register only) */}
                        {mode === "register" && password.length > 0 && (
                            <div className="flex gap-1 h-1">
                                {[1, 2, 3, 4].map(i => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "flex-1 rounded-full transition-all duration-300",
                                            password.length >= i * 3
                                                ? i <= 1 ? "bg-red-500" : i <= 2 ? "bg-yellow-500" : i <= 3 ? "bg-green-400" : "bg-green-500"
                                                : "bg-border"
                                        )}
                                    />
                                ))}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading || (mode === "login" ? !isLoginValid : !isRegisterValid)}
                            className={cn(
                                "w-full h-12 font-black uppercase tracking-widest text-xs rounded-xl transition-all duration-300 active:scale-[0.98] mt-2",
                                mode === "login"
                                    ? "bg-brand text-white hover:bg-brand/90 shadow-lg shadow-brand/25"
                                    : "bg-accent text-black hover:bg-accent/90 shadow-lg shadow-accent/20"
                            )}
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    {mode === "login" ? "Sign In" : "Create Free Account"}
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            )}
                        </Button>

                        {/* Google Sign In Divider */}
                        <div className="mt-6 flex items-center gap-3">
                            <div className="flex-1 h-px bg-border/50" />
                            <span className="text-xs text-muted-foreground/50 uppercase tracking-widest font-semibold">Or continue with</span>
                            <div className="flex-1 h-px bg-border/50" />
                        </div>

                        {/* Google Sign In Button */}
                        <button
                            type="button"
                            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                            disabled={loading}
                            className="w-full h-12 border border-border/50 rounded-xl bg-surface-raised/30 hover:bg-surface-raised/50 text-white font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                        >
                            <Chrome className="h-5 w-5" />
                            Google
                        </button>
                    </form>

                    {/* Test credentials hint (login only) */}
                    {mode === "login" && (
                        <div
                            onClick={() => { setEmail("test@biopage.store"); setPassword("Test1234!"); }}
                            className="mt-4 p-3 rounded-xl border border-brand/20 bg-brand/5 cursor-pointer hover:bg-brand/10 transition-all group"
                        >
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-3.5 w-3.5 text-brand shrink-0" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-brand">Test Account — Click to fill</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                        <span className="font-mono">test@biopage.store</span> · <span className="font-mono">Test1234!</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-muted-foreground/60">
                            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => { setMode(mode === "login" ? "register" : "login"); setEmail(""); setPassword(""); setUsername(""); setName(""); }}
                                className="text-brand font-bold hover:underline"
                            >
                                {mode === "login" ? "Sign up free" : "Sign in"}
                            </button>
                        </p>
                        <p className="text-[10px] text-muted-foreground/30 mt-3">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
