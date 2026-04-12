import { Metadata } from "next";
import { CheckCircle2, XCircle, Clock, Eye, TrendingUp, Package, AlertCircle, Trash2, Edit } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Product Moderation | Admin Panel",
};

async function getProducts() {
    try {
        const products = await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                price: true,
                type: true,
                published: true,
                createdAt: true,
                user: {
                    select: {
                        username: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        });

        // Get sales data for each product
        const productsWithStats = await Promise.all(
            products.map(async (product) => {
                const [orderCount, totalSales] = await Promise.all([
                    prisma.order.count({ where: { productId: product.id } }),
                    prisma.order.aggregate({
                        where: { productId: product.id },
                        _sum: { amount: true }
                    })
                ]);

                return {
                    ...product,
                    orderCount,
                    totalSales: totalSales._sum.amount || 0,
                };
            })
        );

        return productsWithStats;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export default async function ProductModerationPage() {
    const products = await getProducts();

    const pending = products.filter(p => !p.published).length;
    const approved = products.filter(p => p.published).length;
    const totalSales = products.reduce((sum, p) => sum + p.totalSales, 0);

    return (
        <div className="space-y-8 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white mb-2">Product Moderation</h1>
                <p className="text-muted-foreground">Review and approve creator products</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card-modern">
                    <p className="text-sm text-muted-foreground mb-1">Total Products</p>
                    <h3 className="text-3xl font-black text-white">{products.length}</h3>
                    <p className="text-xs text-white/70 mt-2">All listings</p>
                </div>

                <div className="card-modern border-yellow-500/30 bg-yellow-500/5">
                    <p className="text-sm text-muted-foreground mb-1">Pending Approval</p>
                    <h3 className="text-3xl font-black text-yellow-400">{pending}</h3>
                    <p className="text-xs text-yellow-400 mt-2">Waiting review</p>
                </div>

                <div className="card-modern">
                    <p className="text-sm text-muted-foreground mb-1">Approved</p>
                    <h3 className="text-3xl font-black text-emerald-400">{approved}</h3>
                    <p className="text-xs text-emerald-400 mt-2">Live products</p>
                </div>

                <div className="card-modern">
                    <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
                    <h3 className="text-3xl font-black text-blue-400">${(totalSales / 1000).toFixed(1)}K</h3>
                    <p className="text-xs text-blue-400 mt-2">All-time revenue</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card-modern">
                <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition text-sm font-semibold">
                        All Products
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30 transition text-sm font-semibold">
                        Pending ({pending})
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition text-sm font-semibold">
                        Approved ({approved})
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition text-sm font-semibold">
                        Flagged
                    </button>
                </div>
            </div>

            {/* Products Grid */}
            <div className="space-y-4">
                {pending > 0 && (
                    <div>
                        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-yellow-400" />
                            Pending Approval ({pending})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products
                                .filter(p => !p.published)
                                .map((product) => (
                                    <div key={product.id} className="card-modern border-yellow-500/30 bg-yellow-500/5">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Package className="h-5 w-5 text-yellow-400" />
                                                <span className="text-xs font-bold text-yellow-400 bg-yellow-400/20 px-2 py-1 rounded">
                                                    Pending
                                                </span>
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-white mb-2">{product.name}</h4>
                                        <p className="text-sm text-muted-foreground mb-2">{product.user.username}</p>
                                        <div className="flex items-center justify-between text-sm mb-4">
                                            <span className="text-white">${product.price}</span>
                                            <span className="text-muted-foreground text-xs">{product.type}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex-1 px-3 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition text-sm font-semibold">
                                                <CheckCircle2 className="h-4 w-4 inline mr-1" />
                                                Approve
                                            </button>
                                            <button className="flex-1 px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition text-sm font-semibold">
                                                <XCircle className="h-4 w-4 inline mr-1" />
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Approved Products */}
                {approved > 0 && (
                    <div>
                        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            Approved Products ({approved})
                        </h3>
                        <div className="card-modern overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-slate-800/50">
                                            <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Product</th>
                                            <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Creator</th>
                                            <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Price</th>
                                            <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Sales</th>
                                            <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Revenue</th>
                                            <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {products
                                            .filter(p => p.published)
                                            .map((product) => (
                                                <tr key={product.id} className="hover:bg-white/5 transition">
                                                    <td className="py-4 px-4">
                                                        <p className="font-semibold text-white">{product.name}</p>
                                                        <p className="text-xs text-muted-foreground">{product.type}</p>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div>
                                                            <p className="text-sm text-white">{product.user.username}</p>
                                                            <p className="text-xs text-muted-foreground">{product.user.email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-white font-semibold">${product.price}</td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-1">
                                                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                                                            <span className="text-white font-semibold">{product.orderCount}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-emerald-400 font-semibold">${product.totalSales.toFixed(2)}</td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex gap-2">
                                                            <button className="p-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition">
                                                                <Eye className="h-4 w-4" />
                                                            </button>
                                                            <button className="p-1.5 rounded-lg bg-slate-700/20 border border-white/10 text-white hover:bg-slate-700/40 transition">
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                            <button className="p-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition">
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
