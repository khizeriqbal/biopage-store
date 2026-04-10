import { notFound } from "next/navigation";
import {
    Download,
    Video,
    ArrowRight,
    CheckCircle2,
    Star,
    ShoppingBag,
    ExternalLink,
    ChevronRight,
    Zap,
    Package,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Metadata } from "next";
import { formatPrice } from "@/lib/utils";

interface Props {
    params: { orderId: string };
}

export const metadata: Metadata = {
    title: "Order Access | bio page.store",
    robots: "noindex, nofollow",
};

export default async function AccessPage({ params }: Props) {
    const order = await prisma.order.findUnique({
        where: { id: params.orderId },
        include: {
            product: true,
            seller: {
                include: {
                    pageSettings: true,
                    bundles: {
                        where: { published: true },
                        include: {
                            items: {
                                include: { product: { select: { id: true, title: true, price: true, coverImage: true } } }
                            }
                        },
                        take: 2,
                    }
                }
            },
            review: true,
        }
    });

    if (!order || order.status !== "COMPLETED") {
        notFound();
    }

    const { product, seller } = order;
    const primaryColor = seller.pageSettings?.primaryColor || "#5C4EFA";
    const upsellBundles = seller.bundles.filter(b =>
        !b.items.some(i => i.productId === product.id)
    );

    return (
        <div className="min-h-screen bg-dark-bg text-dark-text py-20 px-6 selection:bg-brand selection:text-white">
            <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in duration-700">

                {/* Success header */}
                <div className="flex flex-col items-center text-center space-y-5">
                    <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center text-accent shadow-2xl animate-bounce duration-[2000ms]">
                        <CheckCircle2 className="h-10 w-10 shrink-0" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-white tracking-tighter sm:text-5xl">Your purchase is ready! ✨</h1>
                        <p className="text-lg text-muted-foreground font-medium max-w-md mx-auto leading-relaxed">
                            Thank you for supporting <strong>{seller.name || seller.username}</strong> by purchasing <strong>{product.title}</strong>.
                        </p>
                    </div>
                </div>

                {/* Product access card */}
                <div className="rounded-3xl border border-border bg-gradient-to-br from-surface-raised/60 to-surface-raised/30 backdrop-blur-md overflow-hidden shadow-2xl p-8 relative group">
                    <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="flex flex-col md:flex-row items-center gap-8 relative">
                        <div className="h-40 w-40 relative rounded-2xl overflow-hidden shadow-2xl shrink-0">
                            {product.coverImage ? (
                                <img src={product.coverImage} alt={product.title} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full bg-brand/10 flex items-center justify-center text-brand">
                                    <ShoppingBag className="h-12 w-12" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-5 py-2">
                            <div className="space-y-1 text-center md:text-left">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Order #{order.id.slice(0, 8)}</p>
                                <h2 className="text-2xl font-black text-white tracking-tight">{product.title}</h2>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                {product.type === "DIGITAL" && product.fileUrl && (
                                    <Button className="flex-1 h-12 rounded-2xl bg-brand text-white hover:bg-brand/90 font-black uppercase tracking-wider text-[11px] shadow-xl" asChild>
                                        <a href={product.fileUrl} download>
                                            <Download className="h-4 w-4 mr-2" /> Download File
                                        </a>
                                    </Button>
                                )}
                                {product.type === "COURSE" && (
                                    <Button className="flex-1 h-12 rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase tracking-wider text-[11px] shadow-xl" asChild>
                                        <Link href={`/courses/${product.id}`}>
                                            <Video className="h-4 w-4 mr-2" /> Continue to Course <ArrowRight className="h-4 w-4 ml-2" />
                                        </Link>
                                    </Button>
                                )}
                                {product.type === "BOOKING" && (
                                    <Button className="flex-1 h-12 rounded-2xl bg-blue-500 text-white hover:bg-blue-600 font-black uppercase tracking-wider text-[11px] shadow-xl" asChild>
                                        <a href="https://calendly.com" target="_blank">
                                            <ExternalLink className="h-4 w-4 mr-2" /> Schedule Session
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions: Review + Community */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {!order.review ? (
                        <Link
                            href={`/review/${order.id}`}
                            className="p-6 rounded-3xl border border-border bg-surface-raised/20 flex flex-col items-center text-center gap-4 hover:bg-surface-raised/40 hover:border-yellow-500/30 transition-all cursor-pointer group"
                        >
                            <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
                                <Star className="h-5 w-5 fill-current" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Leave a Review</h4>
                                <p className="text-xs text-muted-foreground">Help others by sharing your experience</p>
                            </div>
                        </Link>
                    ) : (
                        <div className="p-6 rounded-3xl border border-green-500/20 bg-green-500/5 flex flex-col items-center text-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Review Submitted</h4>
                                <p className="text-xs text-muted-foreground">Thank you for your feedback!</p>
                            </div>
                        </div>
                    )}

                    <div className="p-6 rounded-3xl border border-border bg-surface-raised/20 flex flex-col items-center text-center gap-4 hover:bg-surface-raised/40 transition-all group">
                        <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
                            <Zap className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Join Communities</h4>
                            <p className="text-xs text-muted-foreground">Access private Discord and Telegram groups.</p>
                        </div>
                    </div>
                </div>

                {/* Upsell bundles */}
                {upsellBundles.length > 0 && (
                    <div className="space-y-4">
                        <div className="text-center space-y-1">
                            <h3 className="text-xl font-black text-white">You might also love...</h3>
                            <p className="text-sm text-muted-foreground">Exclusive bundles from {seller.name || seller.username}</p>
                        </div>
                        <div className="grid gap-4">
                            {upsellBundles.map(bundle => {
                                const totalValue = bundle.items.reduce((s, i) => s + i.product.price, 0);
                                return (
                                    <div key={bundle.id} className="p-6 rounded-3xl border border-brand/20 bg-brand/5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-4 w-4 text-brand" />
                                                    <h4 className="font-bold text-white">{bundle.name}</h4>
                                                    {totalValue > bundle.bundlePrice && (
                                                        <Badge className="bg-accent/20 text-accent border-none text-[10px] font-bold">
                                                            Save {formatPrice(totalValue - bundle.bundlePrice)}
                                                        </Badge>
                                                    )}
                                                </div>
                                                {bundle.description && <p className="text-sm text-muted-foreground mt-1">{bundle.description}</p>}
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {bundle.items.map(i => (
                                                        <Badge key={i.product.id} variant="outline" className="text-[10px] border-border text-muted-foreground">
                                                            {i.product.title}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0 ml-4">
                                                {totalValue > bundle.bundlePrice && (
                                                    <p className="text-xs text-muted-foreground line-through">{formatPrice(totalValue)}</p>
                                                )}
                                                <p className="text-2xl font-black text-accent">{formatPrice(bundle.bundlePrice)}</p>
                                            </div>
                                        </div>
                                        <Button
                                            className="w-full font-bold rounded-xl h-11"
                                            style={{ backgroundColor: primaryColor }}
                                            asChild
                                        >
                                            <Link href={`/${seller.username}?bundle=${bundle.id}`}>
                                                Get This Bundle <ArrowRight className="h-4 w-4 ml-2" />
                                            </Link>
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <footer className="mt-12 pt-8 text-center opacity-40 hover:opacity-100 transition-opacity">
                    <Link href={`/${seller.username}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center gap-2 group">
                        <ChevronRight className="h-3 w-3 rotate-180 text-brand" />
                        Back to {seller.name || seller.username}'s Store
                    </Link>
                </footer>
            </div>
        </div>
    );
}
