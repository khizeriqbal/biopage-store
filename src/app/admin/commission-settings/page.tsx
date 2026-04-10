import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Settings, Save, DollarSign } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Commission Settings | Admin Panel",
};

async function getCommissionSettings() {
    try {
        const settings = await prisma.platformConfig.findMany({
            where: {
                key: {
                    in: ["PRODUCT_COMMISSION", "COURSE_COMMISSION", "SUBSCRIPTION_COMMISSION", "AFFILIATE_COMMISSION"]
                }
            }
        });

        // Return with defaults if not found
        const defaults: Record<string, number> = {
            PRODUCT_COMMISSION: 0.30,
            COURSE_COMMISSION: 0.25,
            SUBSCRIPTION_COMMISSION: 0.40,
            AFFILIATE_COMMISSION: 0.15,
        };

        const result = { ...defaults };
        settings.forEach(s => {
            result[s.key] = parseFloat(s.value);
        });

        return result;
    } catch (error) {
        console.error("Error fetching commission settings:", error);
        return {
            PRODUCT_COMMISSION: 0.30,
            COURSE_COMMISSION: 0.25,
            SUBSCRIPTION_COMMISSION: 0.40,
            AFFILIATE_COMMISSION: 0.15,
        };
    }
}

export default async function CommissionSettingsPage() {
    const commissions = await getCommissionSettings();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white mb-2">Commission Settings</h1>
                <p className="text-muted-foreground">
                    Configure platform commission rates for different product types
                </p>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Commission */}
                <div className="rounded-xl border border-border/50 bg-surface-raised/50 backdrop-blur-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <DollarSign className="h-5 w-5 text-blue-400" />
                        <h2 className="text-lg font-semibold text-white">Digital Products</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Commission taken on digital product sales (templates, guides, etc.)
                    </p>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-muted-foreground mb-2 block">
                                Commission Rate
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    defaultValue={(commissions.PRODUCT_COMMISSION * 100).toFixed(0)}
                                    min="0"
                                    max="100"
                                    className="flex-1 px-3 py-2 rounded bg-black/30 border border-border/30 text-white text-sm"
                                    placeholder="30"
                                />
                                <span className="text-white font-semibold">%</span>
                            </div>
                        </div>
                        <div className="bg-black/20 p-3 rounded">
                            <p className="text-xs text-muted-foreground">
                                <strong>Example:</strong> $100 sale → You keep ${(100 * commissions.PRODUCT_COMMISSION).toFixed(2)}, Creator gets ${(100 * (1 - commissions.PRODUCT_COMMISSION)).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Course Commission */}
                <div className="rounded-xl border border-border/50 bg-surface-raised/50 backdrop-blur-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <DollarSign className="h-5 w-5 text-green-400" />
                        <h2 className="text-lg font-semibold text-white">Courses</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Commission taken on course sales
                    </p>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-muted-foreground mb-2 block">
                                Commission Rate
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    defaultValue={(commissions.COURSE_COMMISSION * 100).toFixed(0)}
                                    min="0"
                                    max="100"
                                    className="flex-1 px-3 py-2 rounded bg-black/30 border border-border/30 text-white text-sm"
                                    placeholder="25"
                                />
                                <span className="text-white font-semibold">%</span>
                            </div>
                        </div>
                        <div className="bg-black/20 p-3 rounded">
                            <p className="text-xs text-muted-foreground">
                                <strong>Example:</strong> $500 sale → You keep ${(500 * commissions.COURSE_COMMISSION).toFixed(2)}, Creator gets ${(500 * (1 - commissions.COURSE_COMMISSION)).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Subscription Commission */}
                <div className="rounded-xl border border-border/50 bg-surface-raised/50 backdrop-blur-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <DollarSign className="h-5 w-5 text-yellow-400" />
                        <h2 className="text-lg font-semibold text-white">Subscriptions</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Commission taken on recurring subscription payments
                    </p>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-muted-foreground mb-2 block">
                                Commission Rate
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    defaultValue={(commissions.SUBSCRIPTION_COMMISSION * 100).toFixed(0)}
                                    min="0"
                                    max="100"
                                    className="flex-1 px-3 py-2 rounded bg-black/30 border border-border/30 text-white text-sm"
                                    placeholder="40"
                                />
                                <span className="text-white font-semibold">%</span>
                            </div>
                        </div>
                        <div className="bg-black/20 p-3 rounded">
                            <p className="text-xs text-muted-foreground">
                                <strong>Example:</strong> $99/mo subscription → You keep ${(99 * commissions.SUBSCRIPTION_COMMISSION).toFixed(2)}/mo, Creator gets ${(99 * (1 - commissions.SUBSCRIPTION_COMMISSION)).toFixed(2)}/mo
                            </p>
                        </div>
                    </div>
                </div>

                {/* Affiliate Commission */}
                <div className="rounded-xl border border-border/50 bg-surface-raised/50 backdrop-blur-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <DollarSign className="h-5 w-5 text-purple-400" />
                        <h2 className="text-lg font-semibold text-white">Affiliate Program</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Commission paid to affiliates promoting your platform
                    </p>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-muted-foreground mb-2 block">
                                Commission Rate
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    defaultValue={(commissions.AFFILIATE_COMMISSION * 100).toFixed(0)}
                                    min="0"
                                    max="100"
                                    className="flex-1 px-3 py-2 rounded bg-black/30 border border-border/30 text-white text-sm"
                                    placeholder="15"
                                />
                                <span className="text-white font-semibold">%</span>
                            </div>
                        </div>
                        <div className="bg-black/20 p-3 rounded">
                            <p className="text-xs text-muted-foreground">
                                <strong>Example:</strong> Affiliate brings $1000 in sales → Affiliate earns ${(1000 * commissions.AFFILIATE_COMMISSION).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Box */}
            <div className="rounded-xl border border-border/50 bg-blue-500/10 backdrop-blur-sm p-6">
                <div className="flex gap-3">
                    <Settings className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-1">How Commission Works</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                            When a customer purchases a creator's product, the total amount is split between you (platform) and the creator based on these commission rates. The creator's portion goes to their wallet and can be withdrawn anytime.
                        </p>
                        <p className="text-xs text-muted-foreground">
                            <strong>Important:</strong> Changing these rates affects only new orders. Existing orders keep their original commission rates.
                        </p>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-3">
                <Button className="h-10 px-6">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                </Button>
                <Button variant="outline" className="h-10 px-6">
                    Reset to Defaults
                </Button>
            </div>
        </div>
    );
}
