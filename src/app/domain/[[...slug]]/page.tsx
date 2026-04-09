import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BioHeader } from "@/components/public-page/BioHeader";
import { ProductGrid } from "@/components/public-page/ProductGrid";
import { EmailCapture } from "@/components/public-page/EmailCapture";
import { AnalyticsTracker } from "@/components/public-page/AnalyticsTracker";
import { AffiliateTracker } from "@/components/public-page/AffiliateTracker";
import { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
    searchParams: { customDomain?: string };
    params: { slug?: string[] };
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const customDomain = searchParams.customDomain;

    if (!customDomain) {
        return { title: "Page not found" };
    }

    const user = await prisma.user.findUnique({
        where: { customDomain },
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

export default async function CustomDomainPage({ searchParams, params }: Props) {
    const customDomain = searchParams.customDomain;

    if (!customDomain) {
        notFound();
    }

    const user = await prisma.user.findUnique({
        where: { customDomain },
        include: {
            pageSettings: true,
            products: {
                where: { published: true },
                orderBy: { order: "asc" },
            },
            pageSettings: true,
        },
    });

    if (!user) {
        notFound();
    }

    const headersList = headers();
    const referer = headersList.get("referer");
    const affiliateId = new URL(referer || "http://localhost").searchParams.get("ref");

    return (
        <div className="min-h-screen bg-dark-bg">
            <AnalyticsTracker username={user.username} />
            {affiliateId && <AffiliateTracker affiliateId={affiliateId} />}

            <div className="mx-auto max-w-4xl px-4 pt-8 pb-16">
                <BioHeader user={user} pageSettings={user.pageSettings} />

                {user.products && user.products.length > 0 && (
                    <>
                        <div className="my-12 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                        <ProductGrid
                            products={user.products}
                            username={user.username}
                            affiliateId={affiliateId}
                        />
                    </>
                )}

                {user.pageSettings?.emailCaptureEnabled && (
                    <>
                        <div className="my-12 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                        <EmailCapture username={user.username} />
                    </>
                )}
            </div>
        </div>
    );
}
