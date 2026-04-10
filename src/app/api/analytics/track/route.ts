import { NextResponse } from "next/server";
import { startOfDay } from "date-fns";

export async function POST(req: Request) {
    try {
        const { userId, type } = await req.json();

        if (!userId || !type) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const today = startOfDay(new Date());

        if (type === "pageview") {
            await prisma.analytics.upsert({
                where: {
                    userId_date: {
                        userId,
                        date: today,
                    },
                },
                update: {
                    pageViews: { increment: 1 },
                },
                create: {
                    userId,
                    date: today,
                    pageViews: 1,
                    totalRevenue: 0,
                },
            });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Analytics Tracking Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
