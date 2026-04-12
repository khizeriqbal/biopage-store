import { Metadata } from "next";
import { Mail, TrendingUp, Users, Zap, BarChart3, Target } from "lucide-react";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Email Metrics | Creator Dashboard",
};

export default async function EmailMetricsDashboard() {
    const emailMetrics = {
        campaigns: 24,
        activeCampaigns: 3,
        avgOpenRate: 34.5,
        avgClickRate: 8.2,
        emailRevenue: 12450,
        ordersFromEmail: 234,
        subscribers: 12543,
        engagementRate: 67.3,
        unsubscribeRate: 2.1,
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Email Performance Metrics</h1>
                <p className="text-muted-foreground mt-2">Track campaigns, engagement, and email revenue attribution</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <Mail className="h-5 w-5 text-blue-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Total Campaigns</p>
                    <h3 className="text-3xl font-bold text-white">{emailMetrics.campaigns}</h3>
                    <p className="text-xs text-blue-400 mt-2">Active: {emailMetrics.activeCampaigns}</p>
                </div>

                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <TrendingUp className="h-5 w-5 text-emerald-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Avg Open Rate</p>
                    <h3 className="text-3xl font-bold text-white">{emailMetrics.avgOpenRate}%</h3>
                    <p className="text-xs text-emerald-400 mt-2">Industry avg: 21%</p>
                </div>

                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <Users className="h-5 w-5 text-purple-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Active Subscribers</p>
                    <h3 className="text-3xl font-bold text-white">{(emailMetrics.subscribers / 1000).toFixed(1)}K</h3>
                    <p className="text-xs text-purple-400 mt-2">{emailMetrics.engagementRate}% engaged</p>
                </div>

                <div className="card-modern">
                    <div className="flex items-center justify-between mb-4">
                        <Zap className="h-5 w-5 text-yellow-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Email Revenue</p>
                    <h3 className="text-3xl font-bold text-white">${(emailMetrics.emailRevenue / 1000).toFixed(1)}K</h3>
                    <p className="text-xs text-yellow-400 mt-2">{emailMetrics.ordersFromEmail} orders</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card-modern">
                    <h3 className="font-bold text-white text-lg mb-4">Email Performance Metrics</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-slate-700/20">
                            <span className="text-white">Avg Click Rate</span>
                            <span className="text-emerald-400 font-semibold">{emailMetrics.avgClickRate}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-slate-700/20">
                            <span className="text-white">Unsubscribe Rate</span>
                            <span className="text-red-400 font-semibold">{emailMetrics.unsubscribeRate}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-slate-700/20">
                            <span className="text-white">Email Conversion Rate</span>
                            <span className="text-blue-400 font-semibold">5.8%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-slate-700/20">
                            <span className="text-white">Revenue per Subscriber</span>
                            <span className="text-purple-400 font-semibold">$0.99</span>
                        </div>
                    </div>
                </div>

                <div className="card-modern">
                    <h3 className="font-bold text-white text-lg mb-4">Campaign Types Performance</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between p-2 rounded bg-slate-700/20">
                            <span className="text-white text-sm">Launch Sequences</span>
                            <span className="text-emerald-400 text-sm font-semibold">42.1% open rate</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-slate-700/20">
                            <span className="text-white text-sm">Weekly Newsletters</span>
                            <span className="text-emerald-400 text-sm font-semibold">28.3% open rate</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-slate-700/20">
                            <span className="text-white text-sm">Flash Sales</span>
                            <span className="text-emerald-400 text-sm font-semibold">52.1% open rate</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-slate-700/20">
                            <span className="text-white text-sm">Educational Content</span>
                            <span className="text-emerald-400 text-sm font-semibold">38.7% open rate</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-modern">
                <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                    Top Performing Campaigns
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/20">
                        <div>
                            <p className="text-white font-semibold">Launch Sequence</p>
                            <p className="text-xs text-muted-foreground">3,245 opens, 456 clicks</p>
                        </div>
                        <span className="text-emerald-400 font-semibold">$4,732</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/20">
                        <div>
                            <p className="text-white font-semibold">Flash Sale</p>
                            <p className="text-xs text-muted-foreground">1,956 opens, 312 clicks</p>
                        </div>
                        <span className="text-emerald-400 font-semibold">$4,142</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/20">
                        <div>
                            <p className="text-white font-semibold">Weekly Newsletter</p>
                            <p className="text-xs text-muted-foreground">2,876 opens, 234 clicks</p>
                        </div>
                        <span className="text-emerald-400 font-semibold">$2,390</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
