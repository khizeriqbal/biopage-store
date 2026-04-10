import { notFound } from "next/navigation";
import { BioHeader } from "@/components/public-page/BioHeader";
import { ProductGrid } from "@/components/public-page/ProductGrid";
import { EmailCapture } from "@/components/public-page/EmailCapture";
import { AnalyticsTracker } from "@/components/public-page/AnalyticsTracker";
import { AffiliateTracker } from "@/components/public-page/AffiliateTracker";
import { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
    params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const user = await prisma.user.findUnique({
        where: { username: params.username },
        include: { pageSettings: true },
    });

    if (!user) return { title: "Page not found" };

    const name = user.name || `@${user.username}`;
    const description = user.pageSettings?.seoDesc || user.bio || `${name}'s creator store`;

    return {
        title: user.pageSettings?.seoTitle || `${name} | bio page.store`,
        description,
        openGraph: {
            title: name,
            description,
            images: user.avatar ? [user.avatar] : [],
            type: "profile",
        },
        twitter: {
            card: "summary_large_image",
            title: name,
            description,
            images: user.avatar ? [user.avatar] : [],
        },
    };
}

export default async function PublicBioPage({ params }: Props) {
    const user = await prisma.user.findUnique({
        where: { username: params.username },
        include: {
            pageSettings: true,
            products: {
                where: { published: true },
                orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
                include: {
                    reviews: {
                        where: { approved: true },
                        select: { rating: true },
                    },
                },
            },
        },
    });

    if (!user) notFound();

    const settings = user.pageSettings || {
        primaryColor: "#5C4EFA",
        accentColor: "#C6FF4E",
        layout: [],
        socialLinks: {},
    };

    const leadMagnet = user.products.find(p => p.type === "LEAD_MAGNET");

    // Attach sellerId to products for coupon validation
    const products = user.products.map(p => ({ ...p, sellerId: user.id }));

    return (
        <div className="min-h-screen bg-dark-bg text-dark-text pb-20 selection:bg-brand selection:text-white">
            <div className="max-w-3xl mx-auto flex flex-col items-center">
                <BioHeader user={user as any} settings={settings as any} />

                <div className="w-full px-4 mt-12 space-y-16">
                    {(settings.layout as any[]).length === 0 ? (
                        <>
                            <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                                <ProductGrid
                                    products={products as any}
                                    settings={settings as any}
                                />
                            </section>

                            <section className="animate-in fade-in slide-in-from-bottom-8 duration-900">
                                <EmailCapture
                                    user={user as any}
                                    settings={settings as any}
                                    leadMagnet={leadMagnet as any}
                                />
                            </section>
                        </>
                    ) : (
                        (settings.layout as any[]).filter(b => b.enabled).map((block, idx) => {
                            const delay = 500 + (idx * 200);
                            return (
                                <div
                                    key={block.id}
                                    className="animate-in fade-in slide-in-from-bottom-6 duration-1000"
                                    style={{ animationDelay: `${delay}ms` }}
                                >
                                    {block.type === "PRODUCTS" && (
                                        <ProductGrid products={products as any} settings={settings as any} />
                                    )}
                                    {block.type === "EMAIL" && (
                                        <EmailCapture user={user as any} settings={settings as any} leadMagnet={leadMagnet as any} />
                                    )}
                                    {block.type === "ABOUT" && user.bio && (
                                        <div className="p-8 border border-border bg-surface-raised/40 rounded-3xl space-y-4">
                                            <h4 className="text-xl font-bold text-white tracking-tight">About {user.name?.split(" ")[0]}</h4>
                                            <p className="text-muted-foreground leading-relaxed italic border-l-2 border-brand/50 pl-4">
                                                "{user.bio}"
                                            </p>
                                        </div>
                                    )}
                                    {block.type === "YOUTUBE" && block.url && (
                                        <div className="rounded-3xl overflow-hidden border border-border aspect-video w-full">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${extractYouTubeId(block.url)}`}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    )}
                                    {block.type === "COUNTDOWN" && block.date && (
                                        <CountdownBlock date={block.date} title={block.title} settings={settings as any} />
                                    )}
                                    {block.type === "FAQ" && block.items?.length > 0 && (
                                        <FaqBlock items={block.items} settings={settings as any} />
                                    )}
                                    {block.type === "TESTIMONIAL" && block.quote && (
                                        <div className="p-8 border border-border bg-surface-raised/40 rounded-3xl text-center space-y-4">
                                            <p className="text-lg text-white italic leading-relaxed">"{block.quote}"</p>
                                            {block.author && (
                                                <p className="text-sm text-muted-foreground font-bold">— {block.author}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                <footer className="mt-20 py-12 text-center opacity-40 hover:opacity-100 transition-opacity">
                    <a href="/" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-center gap-2">
                        <span>Powered by bio page.store</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    </a>
                </footer>
            </div>

            <AnalyticsTracker userId={user.id} />
            <AffiliateTracker />
        </div>
    );
}

function extractYouTubeId(url: string): string {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : "";
}

// Client components for interactive blocks
import { CountdownBlock } from "@/components/public-page/CountdownBlock";
import { FaqBlock } from "@/components/public-page/FaqBlock";
