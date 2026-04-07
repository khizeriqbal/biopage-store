import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SubscribersTable } from "@/components/dashboard/SubscribersTable";
import { Button } from "@/components/ui/button";
import { Download, Mail, Zap, ArrowRight, Share2 } from "lucide-react";
import Link from "next/link";

export default async function SubscribersPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return null;

    const subscribers = await prisma.subscriber.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        Your Audience <Mail className="h-6 w-6 text-brand" />
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                        Build your direct connection to fans. You own this list.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-border bg-surface-raised/40 hover:bg-surface-hover hover:text-white h-11 px-5 shadow-sm transition-all group">
                        <Download className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-brand transition-colors" /> CSV Export
                    </Button>
                    <Link href="/dashboard/broadcast">
                        <Button className="bg-brand text-white hover:bg-brand/90 font-bold h-11 px-5 shadow-brand/20 shadow-lg group relative">
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
                            Send Broadcast <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    <SubscribersTable subscribers={subscribers as any} />
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-brand/20 bg-brand/5 space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                                <Zap className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">List Growth</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {subscribers.length > 0 ? `You've added ${subscribers.length} new subscribers in total.` : "Ready to start growing your list? Try these strategies."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-border bg-surface-raised/40 space-y-6">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider leading-none">Growth Ideas</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground group cursor-pointer hover:text-white transition-colors">
                                <div className="h-8 w-8 rounded-lg bg-surface flex items-center justify-center group-hover:bg-brand/10 group-hover:text-brand transition-all">
                                    <Share2 className="h-4 w-4" />
                                </div>
                                <span>Share link in stories</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground group cursor-pointer hover:text-white transition-colors">
                                <div className="h-8 w-8 rounded-lg bg-surface flex items-center justify-center group-hover:bg-brand/10 group-hover:text-brand transition-all">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <span>Add email to profile bio</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
