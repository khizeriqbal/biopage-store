import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { theme, primaryColor, accentColor, layout, socialLinks, customCSS, seoTitle, seoDesc } = await req.json();

        const updated = await prisma.pageSettings.upsert({
            where: { userId },
            update: {
                theme,
                primaryColor,
                accentColor,
                layout: layout || undefined,
                socialLinks: socialLinks || undefined,
                customCSS,
                seoTitle,
                seoDesc,
            },
            create: {
                userId,
                theme: theme || "midnight",
                primaryColor: primaryColor || "#5C4EFA",
                accentColor: accentColor || "#C6FF4E",
                layout: layout || [],
                socialLinks: socialLinks || {},
                customCSS,
                seoTitle,
                seoDesc,
            }
        });

        return NextResponse.json(updated);
    } catch (err: any) {
        console.error("Page Settings Update Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
