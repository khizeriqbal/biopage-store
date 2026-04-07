import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

interface Props {
    searchParams: { customDomain?: string };
}

// This page handles custom domain routing.
// Middleware rewrites /domain?customDomain=shop.yourdomain.com → this page.
export default async function CustomDomainPage({ searchParams }: Props) {
    const customDomain = searchParams.customDomain;
    if (!customDomain) notFound();

    const user = await prisma.user.findUnique({
        where: { customDomain, domainVerified: true },
        select: { username: true },
    });

    if (!user) notFound();

    redirect(`/${user.username}`);
}
