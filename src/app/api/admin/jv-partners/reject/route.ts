import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        await requireAdmin();

        const { partnerId } = await req.json();

        if (!partnerId) {
            return NextResponse.json(
                { error: "Partner ID is required" },
                { status: 400 }
            );
        }

        // Delete rejected partner application
        const partner = await prisma.jvPartner.delete({
            where: { id: partnerId },
        });

        return NextResponse.json({
            success: true,
            message: "JV Partner application rejected",
        });
    } catch (error: any) {
        console.error("Reject partner error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to reject partner" },
            { status: 500 }
        );
    }
}
