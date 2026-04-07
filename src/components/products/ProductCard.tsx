"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    MoreHorizontal,
    Pencil,
    Copy,
    Trash2,
    Eye,
    ShoppingBag,
    ExternalLink
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";

interface ProductCardProps {
    product: {
        id: string;
        title: string;
        type: string;
        price: number;
        comparePrice?: number | null;
        coverImage?: string | null;
        published: boolean;
        salesCount: number;
        totalRevenue: number;
        slug: string;
    };
}

const typeConfig: Record<string, { label: string; color: string }> = {
    DIGITAL: { label: "Digital", color: "bg-blue-500/20 text-blue-400" },
    COURSE: { label: "Course", color: "bg-brand/20 text-brand" },
    BOOKING: { label: "Booking", color: "bg-accent/20 text-accent" },
    MEMBERSHIP: { label: "Members", color: "bg-purple-500/20 text-purple-400" },
    LEAD_MAGNET: { label: "Freebie", color: "bg-green-500/20 text-green-400" },
};

export function ProductCard({ product }: ProductCardProps) {
    const [published, setPublished] = useState(product.published);
    const [isUpdating, setIsUpdating] = useState(false);

    const togglePublished = async () => {
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/products/${product.id}`, {
                method: "PATCH",
                body: JSON.stringify({ published: !published }),
            });
            if (res.ok) {
                setPublished(!published);
                toast.success(`Product ${!published ? 'published' : 'unpublished'}`);
            } else {
                toast.error("Failed to update status");
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setIsUpdating(false);
        }
    };

    const config = typeConfig[product.type] || { label: product.type, color: "bg-muted text-muted-foreground" };

    return (
        <Card className="group border-border bg-surface-raised/40 backdrop-blur-md overflow-hidden transition-all hover:border-brand/30">
            <div className="relative aspect-video w-full overflow-hidden bg-surface">
                {product.coverImage ? (
                    <Image
                        src={product.coverImage}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-brand/20 to-surface-raised">
                        <ShoppingBag className="h-8 w-8 text-brand/40" />
                    </div>
                )}
                <div className="absolute top-2 left-2">
                    <Badge className={`${config.color} border-none font-bold uppercase text-[10px] py-0 px-2 h-5 tracking-wider`}>
                        {config.label}
                    </Badge>
                </div>
            </div>

            <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-white truncate text-lg group-hover:text-brand transition-colors">
                        {product.title}
                    </h3>
                    <DropdownMenu>
                        <DropdownMenuTrigger render={
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-surface-hover hover:text-white">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        } />
                        <DropdownMenuContent align="end" className="bg-surface border-border text-white">
                            <DropdownMenuItem className="focus:bg-brand focus:text-white">
                                <Pencil className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-brand focus:text-white">
                                <Copy className="h-4 w-4 mr-2" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-brand focus:text-white">
                                <ExternalLink className="h-4 w-4 mr-2" /> View Public
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuItem className="focus:bg-destructive focus:text-white text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-3">
                <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-accent">{formatPrice(product.price)}</span>
                    {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.comparePrice)}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5 underline decoration-muted/30 underline-offset-4">
                        {product.salesCount} sales
                    </span>
                    <span className="flex items-center gap-1.5 underline decoration-muted/30 underline-offset-4">
                        {formatPrice(product.totalRevenue)} revenue
                    </span>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-4 border-t border-border flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Switch
                        checked={published}
                        onCheckedChange={togglePublished}
                        disabled={isUpdating}
                        className="data-[state=checked]:bg-brand"
                    />
                    <span className="text-xs font-medium text-muted-foreground">
                        {published ? "Published" : "Draft"}
                    </span>
                </div>
                <Link href={`/dashboard/products/${product.id}`}>
                    <Button variant="ghost" size="sm" className="text-xs font-semibold text-brand hover:bg-brand/10 h-8 px-3">
                        Manage
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
