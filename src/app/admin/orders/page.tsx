import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ShoppingCart, DollarSign, User, Calendar, CheckCircle2, Clock } from "lucide-react";

import prisma from "@/lib/prisma";
export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
    title: "Orders | Admin Panel",
};

async function getOrders() {
    try {
    const orders = await prisma.order.findMany({
        select: {
            id: true,
            amount: true,
            createdAt: true,
            user: {
                select: {
                    email: true,
                    username: true,
                },
            },
            items: {
                select: {
                    product: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
    });

    const totalRevenue = await prisma.order.aggregate({
        _sum: { amount: true },
        _count: true,
    });

    return { orders, totalRevenue };
}

export default async function OrdersPage() {
    const { orders, totalRevenue } = await getOrders();

    return (
        <div className="space-y-8">
            {/* Header & Stats */}
            <div>
                <h1 className="text-3xl font-black text-white mb-6">Orders & Revenue</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Total Orders</p>
                        <p className="text-3xl font-black text-white">{totalRevenue._count}</p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Total Revenue</p>
                        <p className="text-3xl font-black text-green-400">
                            ${(totalRevenue._sum.amount || 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Avg Order Value</p>
                        <p className="text-3xl font-black text-blue-400">
                            ${totalRevenue._count > 0
                                ? ((totalRevenue._sum.amount || 0) / totalRevenue._count).toFixed(2)
                                : "0.00"
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-xl border border-border/50 bg-surface-raised/50 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/30 bg-black/30">
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Order ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Customer
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Product
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Amount
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-black/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <code className="text-xs font-mono text-white/80 bg-black/30 px-2 py-1 rounded">
                                            {order.id.slice(0, 8)}...
                                        </code>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                                            <div className="text-sm text-white">
                                                {order.user.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-white/80 truncate max-w-xs">
                                            {order.items[0]?.product.name || "Multiple items"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-semibold text-green-400 flex items-center gap-1">
                                            <DollarSign className="h-3 w-3" />
                                            {order.amount.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-white/80 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-xs font-bold text-green-300">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Paid
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Button size="sm" variant="outline" className="h-8 text-xs">
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {orders.length === 0 && (
                <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders found</p>
                </div>
            )}
        </div>
    );
}
