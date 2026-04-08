import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WhopConnectCard } from "@/components/dashboard/WhopConnectCard";
import { PlanSelector } from "@/components/dashboard/PlanSelector";
import { CustomDomainCard } from "@/components/dashboard/CustomDomainCard";
import {
    Settings,
    User,
    ShieldCheck,
    Globe,
    Bell,
    CreditCard,
    AtSign,
    ChevronRight,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return null;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { pageSettings: true }
    });

    if (!user) return null;

    return (
        <div className="space-y-12 pb-24 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    Store Settings <Settings className="h-6 w-6 text-muted-foreground" />
                </h1>
                <p className="text-muted-foreground">Manage your account, billing, and global configuration.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left side: General Settings */}
                <div className="lg:col-span-2 space-y-12">
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-brand/10 flex items-center justify-center text-brand shadow-lg">
                                <User className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">Personal Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                                <Input
                                    defaultValue={user.name || ""}
                                    className="bg-surface-raised border-border h-11 px-4 font-semibold text-white focus:ring-brand shadow-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                                <Input
                                    defaultValue={user.email || ""}
                                    disabled
                                    className="bg-surface-raised border-border h-11 px-4 font-semibold text-muted-foreground opacity-60 shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl border border-border bg-surface-raised/40 flex items-center justify-between gap-6 group">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-surface flex items-center justify-center text-muted-foreground group-hover:bg-brand/10 group-hover:text-brand transition-all shadow-md">
                                    <AtSign className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white uppercase tracking-wider">Public Username</p>
                                    <p className="text-xs text-muted-foreground">biopage.store/{user.username}</p>
                                </div>
                            </div>
                            <Button variant="outline" className="h-9 text-xs border-border bg-surface shadow-sm hover:bg-surface-hover hover:text-white font-bold uppercase">
                                Change <ArrowRight className="h-3 w-3 ml-2" />
                            </Button>
                        </div>
                    </section>

                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent shadow-lg">
                                <CreditCard className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">Billing & Subscription</h3>
                        </div>

                        <PlanSelector currentPlan={user.plan} />
                    </section>

                    {/* Custom Domain section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-lg">
                                <Globe className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">Custom Domain</h3>
                        </div>
                        <CustomDomainCard
                            currentDomain={user.customDomain}
                            domainVerified={user.domainVerified}
                            plan={user.plan}
                        />
                    </section>
                </div>

                {/* Right side: Integrations & Status */}
                <div className="space-y-8">
                    <WhopConnectCard
                        connected={!!user.whopCompanyId}
                        onboarded={!!user.whopCompanyId}
                    />

                    <div className="p-8 rounded-3xl border border-border bg-surface-raised/40 space-y-8 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-md">
                                <Globe className="h-4 w-4" />
                            </div>
                            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] leading-none">Quick Links</h4>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: "Public Page", icon: Globe, href: `/${user.username}`, external: true },
                                { label: "Notification Prefs", icon: Bell, href: "/dashboard/settings/notifications" },
                                { label: "Security & Passwords", icon: ShieldCheck, href: "/dashboard/settings/security" },
                                { label: "Invoices & Receipts", icon: CreditCard, href: "/dashboard/settings/billing" },
                            ].map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target={link.external ? "_blank" : "_self"}
                                    className="flex items-center justify-between p-4 rounded-xl hover:bg-surface group transition-all duration-300 border border-transparent hover:border-border"
                                >
                                    <div className="flex items-center gap-4">
                                        <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-brand transition-colors" />
                                        <span className="text-sm font-semibold text-muted-foreground group-hover:text-white transition-colors">{link.label}</span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
