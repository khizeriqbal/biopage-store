"use client";

import { useState } from "react";
import {
    Check,
    ChevronRight,
    ChevronLeft,
    User,
    ShoppingBag,
    Sparkles,
    CreditCard,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Clock,
    ArrowRight,
    Zap,
    LayoutGrid,
    Video,
    Calendar,
    Globe,
    Upload,
    HandMetal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AiButton } from "@/components/products/AiButton";
import { WhopConnectCard } from "@/components/dashboard/WhopConnectCard";

const steps = [
    { id: 1, name: "Profile", icon: User, desc: "Personalize your link" },
    { id: 2, name: "Offering", icon: ShoppingBag, desc: "What will you sell?" },
    { id: 3, name: "Magic", icon: Sparkles, desc: "AI Bio generation" },
    { id: 4, name: "Payouts", icon: CreditCard, desc: "Get paid instantly" },
];

export function OnboardingFlow({ user }: { user: any }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState(user.username || "");
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [offerings, setOfferings] = useState<string[]>([]);
    const [bio, setBio] = useState("");
    const [name, setName] = useState(user.name || "");
    const router = useRouter();

    const checkUsername = async (val: string) => {
        setUsername(val);
        if (val.length < 3) return;
        setIsChecking(true);
        try {
            const res = await fetch(`/api/user/check-username?username=${val}`);
            const data = await res.json();
            setIsAvailable(data.available);
        } catch (err) {
            console.error(err);
        } finally {
            setIsChecking(false);
        }
    };

    const handleNext = async () => {
        if (step === 1 && (!isAvailable || username === "")) {
            toast.error("Please choose an available username");
            return;
        }

        if (step === 4) {
            router.push("/dashboard");
            return;
        }

        setStep(step + 1);
    };

    const saveOnboarding = async () => {
        setLoading(true);
        try {
            await fetch("/api/user/onboarding", {
                method: "POST",
                body: JSON.stringify({ username, bio, name, offerings }),
            });
            handleNext();
        } catch (err) {
            toast.error("An error occurred saving your profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col items-center">
            {/* Step Indicator */}
            <div className="w-full flex items-center justify-between mb-20 px-4 md:px-12">
                {steps.map((s, idx) => (
                    <div key={s.id} className="flex flex-col items-center gap-4 relative z-10">
                        <div className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl border-2",
                            step === s.id ? "bg-brand text-white border-brand scale-110" :
                                step > s.id ? "bg-accent/10 text-accent border-accent/20" : "bg-surface-raised text-muted-foreground border-border"
                        )}>
                            {step > s.id ? <Check className="h-6 w-6" /> : <s.icon className="h-5 w-5" />}
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest leading-none",
                                step === s.id ? "text-brand" : "text-muted-foreground"
                            )}>Step 0{s.id}</span>
                            <span className="text-sm font-bold text-white hidden md:block">{s.name}</span>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className={cn(
                                "absolute top-6 left-16 h-0.5 w-[calc(100%-128px)] -z-10 transition-all duration-700 mx-1",
                                step > s.id ? "bg-accent" : "bg-border/30"
                            )} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div className="w-full min-h-[500px] flex flex-col items-center">
                {step === 1 && (
                    <div className="w-full max-w-md space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl font-black text-white tracking-tighter leading-tight">Claim your storefront</h2>
                            <p className="text-muted-foreground font-medium text-lg px-2">Choose the name your fans will see. You can change this later.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Your Full Name</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ariana Grande"
                                    className="bg-surface-raised border-border h-14 px-5 text-lg font-bold text-white shadow-xl focus:ring-brand"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Choose Username</Label>
                                <div className="relative group/field">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-lg opacity-40">biopage.store/</span>
                                    <Input
                                        value={username}
                                        onChange={(e) => checkUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
                                        className="pl-36 bg-surface-raised border-border h-14 px-5 text-lg font-bold text-white shadow-xl focus:ring-brand"
                                    />
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                        {isChecking ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> :
                                            isAvailable === true ? <CheckCircle2 className="h-5 w-5 text-accent" /> :
                                                isAvailable === false ? <AlertCircle className="h-5 w-5 text-destructive" /> : null}
                                    </div>
                                </div>
                                {isAvailable === false && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1 animate-pulse">That name is taken, try something else!</p>}
                            </div>
                        </div>

                        <Button
                            onClick={handleNext}
                            disabled={!isAvailable || !name}
                            className="w-full h-14 bg-brand text-white hover:bg-brand/90 font-black uppercase tracking-widest shadow-xl shadow-brand/20 rounded-2xl group transition-all"
                        >
                            Let's Continue <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="w-full max-w-2xl space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center space-y-4">
                            <div className="h-16 w-16 rounded-3xl bg-accent/10 flex items-center justify-center text-accent mx-auto shadow-2xl">
                                <ShoppingBag className="h-8 w-8" />
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tighter leading-tight">What are you selling?</h2>
                            <p className="text-muted-foreground font-medium text-lg px-2">This helps us tailor your storefront layout and templates.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { id: "digital", label: "Digital Assets", sub: "Presets, eBooks, LUTs", icon: Zap },
                                { id: "course", label: "Video Courses", sub: "Cohorts, Evergreen", icon: Video },
                                { id: "booking", label: "Expert Booking", sub: "Coaching, Consults", icon: Calendar },
                                { id: "leads", label: "Lead Magnets", sub: "Freebies, Newsletters", icon: Sparkles },
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => offerings.includes(opt.id) ? setOfferings(offerings.filter(o => o !== opt.id)) : setOfferings([...offerings, opt.id])}
                                    className={cn(
                                        "p-6 rounded-3xl border text-left transition-all duration-300 relative overflow-hidden group/opt",
                                        offerings.includes(opt.id) ? "border-accent bg-accent/10 ring-2 ring-accent/50 shadow-2xl" : "border-border bg-surface-raised/40 hover:bg-surface-hover hover:border-brand/40"
                                    )}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className={cn(
                                            "h-12 w-12 rounded-2xl flex items-center justify-center transition-all group-hover/opt:scale-110",
                                            offerings.includes(opt.id) ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                                        )}>
                                            <opt.icon className="h-6 w-6" />
                                        </div>
                                        {offerings.includes(opt.id) && <CheckCircle2 className="h-5 w-5 text-accent" />}
                                    </div>
                                    <div className="mt-8 space-y-1">
                                        <h4 className="text-xl font-bold text-white tracking-tight">{opt.label}</h4>
                                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">{opt.sub}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <Button variant="ghost" onClick={() => setStep(1)} className="h-14 px-8 text-muted-foreground font-bold hover:bg-surface-hover">
                                Back
                            </Button>
                            <Button
                                onClick={handleNext}
                                className="flex-1 h-14 bg-brand text-white hover:bg-brand/90 font-black uppercase tracking-widest shadow-xl shadow-brand/20 rounded-2xl"
                            >
                                Looks Good <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="w-full max-w-md space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center space-y-4">
                            <div className="h-16 w-16 rounded-3xl bg-brand/10 flex items-center justify-center text-brand mx-auto shadow-2xl animate-pulse">
                                <Sparkles className="h-8 w-8" />
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tighter leading-tight">Your Bio by AI</h2>
                            <p className="text-muted-foreground font-medium text-lg px-2">Tell us what you do, or let Gemini write it for you.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Short Description</Label>
                                    <AiButton
                                        endpoint="/api/ai/bio"
                                        payload={{ name, niche: offerings[0] || "creator" }}
                                        onStream={(chunk) => {
                                            if (chunk === "") setBio("");
                                            else setBio(prev => prev + chunk);
                                        }}
                                        variant="brand"
                                        size="sm"
                                        label="Generate with AI"
                                    />
                                </div>
                                <Textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="I help people..."
                                    className="bg-surface-raised border-border min-h-[160px] p-6 text-lg font-medium leading-relaxed shadow-xl resize-none rounded-2xl"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button variant="ghost" onClick={() => setStep(2)} className="h-14 px-8 text-muted-foreground font-bold hover:bg-surface-hover">
                                Back
                            </Button>
                            <Button
                                onClick={saveOnboarding}
                                disabled={loading || !bio}
                                className="flex-1 h-14 bg-brand text-white hover:bg-brand/90 font-black uppercase tracking-widest shadow-xl shadow-brand/20 rounded-2xl"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                                Complete Profile
                            </Button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="w-full max-w-md space-y-12 animate-in fade-in zoom-in duration-700">
                        <div className="text-center space-y-4">
                            <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center text-accent mx-auto shadow-2xl scale-110">
                                <HandMetal className="h-8 w-8" />
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tighter leading-tight">Last Step: Payouts</h2>
                            <p className="text-muted-foreground font-medium text-lg px-2">Ready to collect earnings? Hook up your Whop account in seconds.</p>
                        </div>

                        <WhopConnectCard
                            connected={!!user.whopCompanyId}
                            onboarded={!!user.whopCompanyId}
                        />

                        <div className="space-y-3">
                            <Button
                                onClick={() => router.push("/dashboard")}
                                className="w-full h-14 border border-border bg-surface-raised/50 hover:bg-surface-hover text-white font-black uppercase tracking-widest rounded-2xl transition-all"
                            >
                                Skip for now, show me my dashboard
                            </Button>
                            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-40">Direct-to-bank transfers. No holding periods.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
