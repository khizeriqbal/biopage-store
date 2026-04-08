import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductsClient } from "./components/ProductsClient";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';


export default async function ProductsPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return null;

    const products = await prisma.product.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        My Store
                    </h1>
                    <p className="text-muted-foreground">Manage your digital empire and services.</p>
                </div>

                <ProductsClient />
            </div>

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-2xl bg-surface-raised/20 text-center gap-6">
                    <div className="h-16 w-16 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                        <Plus className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white tracking-tight">No products yet</h3>
                        <p className="text-muted-foreground max-w-sm">
                            Launch your first digital download, course, or service and start earning today.
                        </p>
                    </div>
                    <ProductsClient showButton />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
