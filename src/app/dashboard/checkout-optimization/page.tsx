import { Metadata } from "next";
import { ShoppingCart, TrendingUp, ZapOff, RotateCw, Gift, AlertCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Checkout Optimization | Creator Dashboard",
};

export default async function CheckoutOptimizationPage() {
    const checkoutMetrics = {
        cartStarts: 2145,
        completedCheckouts: 1234,
        declinedOffers: 456,
        bumpOffers: 789,
        abandonedCarts: 234,
        avgCheckoutTime: 2.3,
        checkoutConversion: 57.5,
        bumpConversionRate: 36.2,
        declineOfferConversion: 28.4,
        cartRecoveryRate: 18.2,
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Checkout Optimization</h1>
                <p className="text-muted-foreground mt-2">Improve conversion rates with one-click checkout, bump offers, and cart recovery</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <ShoppingCart className="h-5 w-5 text-blue-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Checkout Conversion</p>
                    <h3 className="text-3xl font-bold text-white">{checkoutMetrics.checkoutConversion}%</h3>
                    <p className="text-xs text-blue-400 mt-2">{checkoutMetrics.cartStarts} carts started</p>
                </div>

                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <Gift className="h-5 w-5 text-emerald-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Bump Offer Conversion</p>
                    <h3 className="text-3xl font-bold text-white">{checkoutMetrics.bumpConversionRate}%</h3>
                    <p className="text-xs text-emerald-400 mt-2">{checkoutMetrics.bumpOffers} bump upsells</p>
                </div>

                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <ZapOff className="h-5 w-5 text-yellow-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Decline Offer Rate</p>
                    <h3 className="text-3xl font-bold text-white">{checkoutMetrics.declineOfferConversion}%</h3>
                    <p className="text-xs text-yellow-400 mt-2">{checkoutMetrics.declinedOffers} customers</p>
                </div>

                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <RotateCw className="h-5 w-5 text-purple-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Cart Recovery Rate</p>
                    <h3 className="text-3xl font-bold text-white">{checkoutMetrics.cartRecoveryRate}%</h3>
                    <p className="text-xs text-purple-400 mt-2">{checkoutMetrics.abandonedCarts} recovered</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card-modern">
                    <h3 className="font-bold text-white text-lg mb-4">Checkout Funnel</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/20">
                            <div>
                                <p className="text-white font-semibold">Cart Started</p>
                                <p className="text-xs text-muted-foreground">Entry point</p>
                            </div>
                            <span className="text-blue-400 font-bold">{checkoutMetrics.cartStarts}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/20">
                            <div>
                                <p className="text-white font-semibold">Checkout Completed</p>
                                <p className="text-xs text-muted-foreground">{checkoutMetrics.checkoutConversion}% conversion</p>
                            </div>
                            <span className="text-emerald-400 font-bold">{checkoutMetrics.completedCheckouts}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/20">
                            <div>
                                <p className="text-white font-semibold">Bump Offer Accepted</p>
                                <p className="text-xs text-muted-foreground">Additional revenue</p>
                            </div>
                            <span className="text-yellow-400 font-bold">{checkoutMetrics.bumpOffers}</span>
                        </div>
                    </div>
                </div>

                <div className="card-modern">
                    <h3 className="font-bold text-white text-lg mb-4">Checkout Performance</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-slate-700/20">
                            <span className="text-white">Avg Checkout Time</span>
                            <span className="text-emerald-400 font-semibold">{checkoutMetrics.avgCheckoutTime} min</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-slate-700/20">
                            <span className="text-white">Abandoned Carts</span>
                            <span className="text-red-400 font-semibold">{checkoutMetrics.abandonedCarts}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-slate-700/20">
                            <span className="text-white">One-Click Enabled</span>
                            <span className="text-blue-400 font-semibold">Yes</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-slate-700/20">
                            <span className="text-white">Recovery Emails Sent</span>
                            <span className="text-purple-400 font-semibold">485</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-modern">
                <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    Optimization Recommendations
                </h3>
                <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <p className="text-sm text-yellow-300 font-semibold">Increase Bump Offer Frequency</p>
                        <p className="text-xs text-muted-foreground mt-1">Your bump conversion is strong at 36.2%. Consider showing in more checkout flows.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <p className="text-sm text-blue-300 font-semibold">Optimize Decline Offer Copy</p>
                        <p className="text-xs text-muted-foreground mt-1">28.4% conversion on decline offers shows good copywriting. Test urgency elements.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-sm text-emerald-300 font-semibold">Expand Cart Recovery Campaign</p>
                        <p className="text-xs text-muted-foreground mt-1">18.2% recovery rate is solid. Add SMS recovery for faster touchpoint.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
