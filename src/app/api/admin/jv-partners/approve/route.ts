import { NextRequest, NextResponse } from "next/server";

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

        const partner = await prisma.jvPartner.update({
            where: { id: partnerId },
            data: { approved: true },
        });

        return NextResponse.json({
            success: true,
            partner,
            message: "JV Partner approved successfully",
        });
    } catch (error: any) {
        console.error("Approve partner error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to approve partner" },
            { status: 500 }
        );
    }
}
