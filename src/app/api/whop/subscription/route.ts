import { auth } from "@/lib/auth";
import { whop } from "@/lib/whop";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { plan } = await req.json();

        if (!plan) {
            return NextResponse.json({ error: "No plan selected" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Whop Plan IDs for the platform itself (not the creators)
        // These would be the merchant-created plans for the 'bio page.store' Whop Company
        const platformPlanIds: Record<string, string> = {
            STARTER: process.env.WHOP_PLAN_STARTER || "plan_starter_placeholder",
            CREATOR: process.env.WHOP_PLAN_CREATOR || "plan_creator_placeholder",
        };

        const whopPlanId = platformPlanIds[plan];

        console.log(`[Whop] Creating platform subscription checkout for plan: ${plan}, Map ID: ${whopPlanId}`);

        if (!whopPlanId || whopPlanId === "plan_starter_placeholder") {
            return NextResponse.json({ error: "Whop Plan ID not configured in .env" }, { status: 400 });
        }

        // Create a checkout configuration for the platform subscription
        // Using common SDK pattern: plan_id at top level
        const checkoutConfig = await (whop.checkoutConfigurations as any).create({
            plan_id: whopPlanId,
            metadata: {
                userId,
                type: 'platform_subscription',
                plan: plan
            },
            redirect_url: `https://biopage.store/dashboard/settings?subscription=success`,
        });

        return NextResponse.json({ url: `https://whop.com/checkout/${checkoutConfig.id}` });
    } catch (err: any) {
        console.error("Whop Subscription Error:", err);
        // Log the full error response if possible
        if (err.response) {
            console.error("Whop API Error Response:", await err.response.json());
        }
        return NextResponse.json({ error: err.message || "Subscription failed" }, { status: 500 });
    }
}
