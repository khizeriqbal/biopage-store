import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Called by Vercel Cron: every hour
// Add to vercel.json: { "crons": [{ "path": "/api/cron/email-sequences", "schedule": "0 * * * *" }] }
export async function GET(req: Request) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    const pendingEnrollments = await prisma.sequenceEnrollment.findMany({
        where: {
            completed: false,
            nextSendAt: { lte: now },
        },
        include: {
            sequence: {
                include: {
                    steps: { orderBy: { position: "asc" } },
                    user: { select: { email: true, name: true } }
                }
            }
        },
        take: 100,
    });

    let sent = 0;

    for (const enrollment of pendingEnrollments) {
        const { sequence, currentStep, email } = enrollment;
        const step = sequence.steps[currentStep];
        if (!step) {
            await prisma.sequenceEnrollment.update({
                where: { id: enrollment.id },
                data: { completed: true }
            });
            continue;
        }

        try {
            await resend.emails.send({
                from: `${sequence.user.name || "Creator"} <noreply@biopage.store>`,
                to: email,
                subject: step.subject,
                html: step.body,
            });

            const nextStep = sequence.steps[currentStep + 1];
            const nextSendAt = nextStep
                ? new Date(Date.now() + nextStep.delayDays * 24 * 60 * 60 * 1000)
                : null;

            await prisma.sequenceEnrollment.update({
                where: { id: enrollment.id },
                data: {
                    currentStep: currentStep + 1,
                    nextSendAt,
                    completed: !nextStep,
                }
            });

            sent++;
        } catch (err) {
            console.error(`Failed to send email to ${email}:`, err);
        }
    }

    return NextResponse.json({ processed: pendingEnrollments.length, sent });
}
