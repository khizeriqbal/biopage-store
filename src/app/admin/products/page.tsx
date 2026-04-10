import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, Eye, Calendar } from "lucide-react";

export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
    title: "Products | Admin Panel",
};

async function getProducts() {
    const products = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            price: true,
            priceType: true,
            createdAt: true,
            user: {
                select: {
                    email: true,
                    username: true,
                },
            },
            _count: {
                select: {
                    orderItems: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
    });

    return products;
}

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">Products</h1>
                    <p className="text-muted-foreground">
                        {products.length} total products
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border/50 bg-surface-raised/50 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/30 bg-black/30">
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Product Name
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Creator
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Price
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Type
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Sales
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Created
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-black/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                                            <span className="text-sm font-semibold text-white truncate">
                                                {product.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-white/80">
                                            {product.user.email}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            @{product.user.username}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-semibold text-white flex items-center gap-1">
                                            <DollarSign className="h-3 w-3" />
                                            {product.price}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-300">
                                            {product.priceType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-white/80">
                                            {product._count.orderItems}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-white/80 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(product.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Button size="sm" variant="outline" className="h-8 text-xs flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {products.length === 0 && (
                <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">No products found</p>
                </div>
            )}
        </div>
    );
}
