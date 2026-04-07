"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Package, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Product {
    id: string;
    title: string;
    price: number;
}

interface Bundle {
    id: string;
    name: string;
    description: string | null;
    bundlePrice: number;
    published: boolean;
    items: { product: Product }[];
}

export default function BundlesPage() {
    const [bundles, setBundles] = useState<Bundle[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        description: "",
        bundlePrice: "",
        selectedProductIds: [] as string[],
    });

    const fetchAll = async () => {
        const [b, p] = await Promise.all([
            fetch("/api/bundles").then(r => r.json()),
            fetch("/api/products").then(r => r.json()),
        ]);
        setBundles(Array.isArray(b) ? b : []);
        setProducts(Array.isArray(p) ? p : []);
    };

    useEffect(() => { fetchAll(); }, []);

    const toggleProduct = (id: string) => {
        setForm(f => ({
            ...f,
            selectedProductIds: f.selectedProductIds.includes(id)
                ? f.selectedProductIds.filter(p => p !== id)
                : [...f.selectedProductIds, id]
        }));
    };

    const handleCreate = async () => {
        if (!form.name || !form.bundlePrice || form.selectedProductIds.length < 2) {
            toast.error("Name, price and at least 2 products are required");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/bundles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, productIds: form.selectedProductIds }),
            });
            if (res.ok) {
                toast.success("Bundle created!");
                setOpen(false);
                setForm({ name: "", description: "", bundlePrice: "", selectedProductIds: [] });
                fetchAll();
            } else {
                const d = await res.json();
                toast.error(d.error || "Failed to create bundle");
            }
        } finally {
            setLoading(false);
        }
    };

    const togglePublish = async (id: string, published: boolean) => {
        await fetch("/api/bundles", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, published: !published }),
        });
        toast.success(published ? "Bundle unpublished" : "Bundle published!");
        fetchAll();
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/bundles?id=${id}`, { method: "DELETE" });
        toast.success("Bundle deleted");
        fetchAll();
    };

    return (
        <div className="space-y-8 pb-24 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        Product Bundles <Package className="h-6 w-6 text-muted-foreground" />
                    </h1>
                    <p className="text-muted-foreground mt-1">Bundle multiple products together at a special price.</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-brand text-white hover:bg-brand/90 font-bold gap-2">
                            <Plus className="h-4 w-4" /> Create Bundle
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-dark-bg border-border max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="text-white">Create Product Bundle</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Bundle Name</Label>
                                <Input
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Ultimate Creator Pack"
                                    className="bg-surface-raised border-border text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description (optional)</Label>
                                <Input
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Everything you need to get started..."
                                    className="bg-surface-raised border-border text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Bundle Price ($)</Label>
                                <Input
                                    type="number"
                                    value={form.bundlePrice}
                                    onChange={e => setForm(f => ({ ...f, bundlePrice: e.target.value }))}
                                    placeholder="49"
                                    className="bg-surface-raised border-border text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select Products (min 2)</Label>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {products.map(p => (
                                        <div
                                            key={p.id}
                                            onClick={() => toggleProduct(p.id)}
                                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                                                form.selectedProductIds.includes(p.id)
                                                    ? "border-brand bg-brand/10 text-white"
                                                    : "border-border bg-surface-raised/40 text-muted-foreground hover:border-brand/30"
                                            }`}
                                        >
                                            <span className="text-sm font-medium">{p.title}</span>
                                            <span className="text-xs font-bold text-accent">{formatPrice(p.price)}</span>
                                        </div>
                                    ))}
                                </div>
                                {form.selectedProductIds.length > 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        Original value: {formatPrice(products.filter(p => form.selectedProductIds.includes(p.id)).reduce((s, p) => s + p.price, 0))}
                                    </p>
                                )}
                            </div>

                            <Button onClick={handleCreate} disabled={loading} className="w-full bg-brand text-white hover:bg-brand/90 font-bold">
                                {loading ? "Creating..." : "Create Bundle"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {bundles.length === 0 ? (
                <div className="text-center py-24 rounded-3xl border border-dashed border-border">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground font-medium">No bundles yet</p>
                    <p className="text-sm text-muted-foreground/60 mt-1">Bundle products together to increase average order value</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {bundles.map((bundle) => {
                        const totalValue = bundle.items.reduce((s, i) => s + i.product.price, 0);
                        const savings = totalValue - bundle.bundlePrice;

                        return (
                            <div key={bundle.id} className="p-6 rounded-2xl border border-border bg-surface-raised/40 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-white">{bundle.name}</h3>
                                            <Badge variant={bundle.published ? "default" : "secondary"} className={bundle.published ? "bg-green-500/20 text-green-400 border-none text-[10px]" : "bg-muted text-muted-foreground border-none text-[10px]"}>
                                                {bundle.published ? "Published" : "Draft"}
                                            </Badge>
                                        </div>
                                        {bundle.description && <p className="text-sm text-muted-foreground mt-1">{bundle.description}</p>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => togglePublish(bundle.id, bundle.published)}
                                            className="text-muted-foreground hover:text-white text-xs gap-1"
                                        >
                                            {bundle.published ? <ToggleRight className="h-4 w-4 text-green-400" /> : <ToggleLeft className="h-4 w-4" />}
                                            {bundle.published ? "Unpublish" : "Publish"}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(bundle.id)}
                                            className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10 h-8 w-8"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-2xl font-black text-accent">{formatPrice(bundle.bundlePrice)}</div>
                                    {savings > 0 && (
                                        <>
                                            <div className="text-sm text-muted-foreground line-through">{formatPrice(totalValue)}</div>
                                            <Badge className="bg-accent/20 text-accent border-none text-xs font-bold">Save {formatPrice(savings)}</Badge>
                                        </>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {bundle.items.map(item => (
                                        <Badge key={item.product.id} variant="outline" className="text-xs border-border text-muted-foreground">
                                            {item.product.title}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
