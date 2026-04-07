import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Bell, Lock, Database, Mail, Zap } from "lucide-react";

export const metadata: Metadata = {
    title: "Settings | Admin Panel",
};

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white mb-2">Settings</h1>
                <p className="text-muted-foreground">Manage platform configuration and integrations</p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-8">
                {/* General Settings */}
                <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <Zap className="h-6 w-6 text-brand" />
                        <h2 className="text-xl font-bold text-white">General Settings</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <Label className="text-sm font-bold mb-2 block">Platform Name</Label>
                            <Input
                                placeholder="bio page.store"
                                className="h-11 bg-black/30 border-border/50 rounded-lg text-white"
                                defaultValue="bio page.store"
                            />
                        </div>

                        <div>
                            <Label className="text-sm font-bold mb-2 block">Support Email</Label>
                            <Input
                                type="email"
                                placeholder="support@biopage.store"
                                className="h-11 bg-black/30 border-border/50 rounded-lg text-white"
                                defaultValue="support@biopage.store"
                            />
                        </div>

                        <Button className="bg-brand text-white hover:bg-brand/90 font-bold rounded-lg">
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* Payment Settings */}
                <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <Mail className="h-6 w-6 text-accent" />
                        <h2 className="text-xl font-bold text-white">Payment Gateway (Whop)</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-lg bg-black/30 border border-border/30 p-4">
                            <p className="text-sm text-white/80 mb-2">
                                <span className="font-bold">Status:</span> ✅ Connected
                            </p>
                            <p className="text-xs text-muted-foreground">
                                API Key: whop_live_...••••••
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-bold mb-2 block">Whop API Key</Label>
                            <Input
                                type="password"
                                placeholder="••••••••••••••••"
                                className="h-11 bg-black/30 border-border/50 rounded-lg text-white"
                            />
                        </div>

                        <Button className="bg-accent text-black hover:bg-accent/90 font-bold rounded-lg">
                            Update API Key
                        </Button>
                    </div>
                </div>

                {/* Email Service */}
                <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <Mail className="h-6 w-6 text-blue-400" />
                        <h2 className="text-xl font-bold text-white">Email Service (Resend)</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-lg bg-black/30 border border-border/30 p-4">
                            <p className="text-sm text-white/80 mb-2">
                                <span className="font-bold">Status:</span> ✅ Connected
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Emails sent this month: 12,450
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-bold mb-2 block">Resend API Key</Label>
                            <Input
                                type="password"
                                placeholder="••••••••••••••••"
                                className="h-11 bg-black/30 border-border/50 rounded-lg text-white"
                            />
                        </div>

                        <Button className="bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-lg">
                            Update API Key
                        </Button>
                    </div>
                </div>

                {/* Database */}
                <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <Database className="h-6 w-6 text-green-400" />
                        <h2 className="text-xl font-bold text-white">Database</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-lg bg-black/30 border border-border/30 p-4">
                            <p className="text-sm text-white/80 mb-2">
                                <span className="font-bold">Status:</span> ✅ Connected
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Supabase PostgreSQL · db.orryqupoutzleqeyaxkm.supabase.co
                            </p>
                        </div>

                        <Button variant="outline" className="w-full rounded-lg">
                            View Database Stats
                        </Button>
                    </div>
                </div>

                {/* Admin Users */}
                <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <Lock className="h-6 w-6 text-yellow-400" />
                        <h2 className="text-xl font-bold text-white">Admin Users</h2>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground mb-4">
                            Add admin user IDs to the .env NEXT_PUBLIC_ADMIN_IDS variable
                        </p>

                        <div className="rounded-lg bg-black/30 border border-border/30 p-4 space-y-2">
                            <p className="text-xs text-white/60">Current admin user IDs in .env:</p>
                            <code className="text-xs font-mono text-yellow-300 block">
                                NEXT_PUBLIC_ADMIN_IDS=user_id_1,user_id_2
                            </code>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            To add more admins, update the environment variable and redeploy.
                        </p>
                    </div>
                </div>

                {/* System Status */}
                <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <Bell className="h-6 w-6 text-orange-400" />
                        <h2 className="text-xl font-bold text-white">System Status</h2>
                    </div>

                    <div className="space-y-3">
                        {[
                            { service: "API Server", status: "healthy" },
                            { service: "Database", status: "healthy" },
                            { service: "Payment Gateway", status: "healthy" },
                            { service: "Email Service", status: "healthy" },
                            { service: "Background Jobs", status: "healthy" },
                        ].map((item) => (
                            <div key={item.service} className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-border/30">
                                <span className="text-sm text-white/80">{item.service}</span>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <span className="text-xs font-bold text-green-300">{item.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
