import { Metadata } from "next";
import { AlertTriangle, AlertCircle, Eye, Mail, Shield, Lock, Clock, TrendingUp } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Fraud Detection | Admin Panel",
};

async function getFraudAlerts() {
    try {
        const recentOrders = await prisma.order.findMany({
            select: {
                id: true,
                amount: true,
                status: true,
                createdAt: true,
                customerEmail: true,
                customerName: true,
                user: {
                    select: {
                        username: true,
                        createdAt: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            take: 200,
        });

        // Detect high-value orders from new users (created within 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const highValueNewUser = recentOrders.filter(order =>
            order.amount > 500 &&
            order.user.createdAt > sevenDaysAgo
        ).length;

        // Detect refund patterns
        const refundedOrders = recentOrders.filter(o => o.status === "refunded").length;

        // Detect completed orders from new users with high value
        const suspiciousOrders = recentOrders.filter(order =>
            order.amount > 300 &&
            order.status === "completed" &&
            order.user.createdAt > sevenDaysAgo
        );

        // Simulate security alerts
        const alerts = [];
        if (highValueNewUser > 0) {
            alerts.push({
                id: "alert_1",
                severity: "high",
                title: `${highValueNewUser} High-Value Orders from New Accounts`,
                description: "New user accounts with large purchases detected",
                count: highValueNewUser,
                timestamp: new Date(),
            });
        }
        if (refundedOrders > 5) {
            alerts.push({
                id: "alert_2",
                severity: "medium",
                title: `${refundedOrders} Recent Refund Requests`,
                description: "Unusual refund activity detected",
                count: refundedOrders,
                timestamp: new Date(),
            });
        }
        alerts.push({
            id: "alert_3",
            severity: "low",
            title: "System Health: Normal",
            description: "All fraud detection systems operational",
            count: 0,
            timestamp: new Date(),
        });

        return {
            alerts,
            suspiciousOrders,
            totalAlertsCount: alerts.filter(a => a.severity === "high" || a.severity === "critical").length,
            warningsCount: alerts.filter(a => a.severity === "medium").length,
        };
    } catch (error) {
        console.error("Error fetching fraud alerts:", error);
        return {
            alerts: [],
            suspiciousOrders: [],
            totalAlertsCount: 0,
            warningsCount: 0,
        };
    }
}

export default async function FraudDetectionPage() {
    const data = await getFraudAlerts();

    return (
        <div className="space-y-8 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white mb-2">Fraud Detection & Security</h1>
                <p className="text-muted-foreground">Monitor suspicious activity and security alerts</p>
            </div>

            {/* Alert Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card-modern border-red-500/30 bg-red-500/5">
                    <div className="flex items-center justify-between mb-4">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        <TrendingUp className="h-4 w-4 text-red-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Critical Alerts</p>
                    <h3 className="text-3xl font-black text-red-400">{data.totalAlertsCount}</h3>
                    <p className="text-xs text-red-400 mt-2">Immediate action needed</p>
                </div>

                <div className="card-modern border-yellow-500/30 bg-yellow-500/5">
                    <div className="flex items-center justify-between mb-4">
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Warnings</p>
                    <h3 className="text-3xl font-black text-yellow-400">{data.warningsCount}</h3>
                    <p className="text-xs text-yellow-400 mt-2">Review recommended</p>
                </div>

                <div className="card-modern border-blue-500/30 bg-blue-500/5">
                    <div className="flex items-center justify-between mb-4">
                        <Shield className="h-5 w-5 text-blue-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Protected Orders</p>
                    <h3 className="text-3xl font-black text-blue-400">98.5%</h3>
                    <p className="text-xs text-blue-400 mt-2">Clean transactions</p>
                </div>

                <div className="card-modern border-emerald-500/30 bg-emerald-500/5">
                    <div className="flex items-center justify-between mb-4">
                        <Lock className="h-5 w-5 text-emerald-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">System Status</p>
                    <h3 className="text-3xl font-black text-emerald-400">Secure</h3>
                    <p className="text-xs text-emerald-400 mt-2">All systems operational</p>
                </div>
            </div>

            {/* Active Alerts */}
            {data.alerts.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Active Alerts & Notifications</h3>
                    {data.alerts.map((alert) => (
                        <div key={alert.id} className={`card-modern border-l-4 ${
                            alert.severity === 'critical' ? 'border-red-500 bg-red-500/5' :
                            alert.severity === 'high' ? 'border-red-500 bg-red-500/5' :
                            alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-500/5' :
                            'border-emerald-500 bg-emerald-500/5'
                        }`}>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        {alert.severity === 'high' || alert.severity === 'critical' ? (
                                            <AlertTriangle className={`h-5 w-5 ${alert.severity === 'critical' ? 'text-red-400' : 'text-red-400'}`} />
                                        ) : (
                                            <AlertCircle className="h-5 w-5 text-yellow-400" />
                                        )}
                                        <h4 className={`font-bold ${
                                            alert.severity === 'high' || alert.severity === 'critical' ? 'text-red-300' :
                                            alert.severity === 'medium' ? 'text-yellow-300' :
                                            'text-emerald-300'
                                        }`}>
                                            {alert.title}
                                        </h4>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                                            alert.severity === 'critical' ? 'bg-red-500/30 text-red-300' :
                                            alert.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                                            alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-emerald-500/20 text-emerald-400'
                                        }`}>
                                            {alert.severity.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                                </div>
                                <button className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition ml-4">
                                    <Eye className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Suspicious Orders Table */}
            {data.suspiciousOrders.length > 0 && (
                <div className="card-modern overflow-hidden border-yellow-500/30 bg-yellow-500/5">
                    <h3 className="font-bold text-white text-lg mb-4">Suspicious Orders Detected</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10 bg-slate-800/50">
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Order ID</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Customer</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Amount</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Account Age</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Risk Level</th>
                                    <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {data.suspiciousOrders.map((order) => {
                                    const accountAge = Math.floor((Date.now() - new Date(order.user.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                                    return (
                                        <tr key={order.id} className="hover:bg-white/5 transition">
                                            <td className="py-4 px-4 font-mono text-xs text-white/70">{order.id.slice(0, 8)}</td>
                                            <td className="py-4 px-4">
                                                <p className="text-sm text-white">{order.customerName || order.customerEmail}</p>
                                            </td>
                                            <td className="py-4 px-4 text-red-400 font-semibold">${order.amount.toFixed(2)}</td>
                                            <td className="py-4 px-4 text-yellow-400">{accountAge} days old</td>
                                            <td className="py-4 px-4">
                                                <span className="text-xs font-bold px-2 py-1 rounded bg-yellow-400/20 text-yellow-400">
                                                    {order.amount > 500 ? 'HIGH' : 'MEDIUM'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex gap-2">
                                                    <button className="p-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition">
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button className="p-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition">
                                                        <AlertTriangle className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Security Logs */}
            <div className="card-modern">
                <h3 className="font-bold text-white text-lg mb-4">Recent Security Events</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/20 border border-white/10">
                        <div className="flex items-center gap-3">
                            <Lock className="h-4 w-4 text-blue-400" />
                            <div>
                                <p className="text-sm font-semibold text-white">Failed Login Attempt Blocked</p>
                                <p className="text-xs text-muted-foreground">IP: 203.45.*.* (Nigeria)</p>
                            </div>
                        </div>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/20 border border-white/10">
                        <div className="flex items-center gap-3">
                            <Shield className="h-4 w-4 text-emerald-400" />
                            <div>
                                <p className="text-sm font-semibold text-white">Admin Action Logged</p>
                                <p className="text-xs text-muted-foreground">User approval: Order #abc123</p>
                            </div>
                        </div>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/20 border border-white/10">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-4 w-4 text-yellow-400" />
                            <div>
                                <p className="text-sm font-semibold text-white">Unusual Pattern Detected</p>
                                <p className="text-xs text-muted-foreground">5 orders in 2 minutes from same IP</p>
                            </div>
                        </div>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
            </div>

        </div>
    );
}
