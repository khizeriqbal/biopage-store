import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { geminiStream, geminiWithRetry } from "@/lib/gemini";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { title, type, niche, price } = await req.json();

    const typeDescriptions: Record<string, string> = {
        DIGITAL: "digital download (PDF, template, or file)",
        COURSE: "online video course",
        BOOKING: "coaching or consulting session",
        MEMBERSHIP: "membership or subscription community",
        LEAD_MAGNET: "free resource in exchange for email signup",
    };

    const prompt = `Write a compelling product description for:
Product: "${title}"
Type: ${typeDescriptions[type] || type}
Creator niche: ${niche || "content creation"}
Price: ${price === 0 ? "Free" : `$${price}`}

Requirements:
- 3-4 sentences
- Start with the OUTCOME or TRANSFORMATION the buyer gets — not features
- Be specific and concrete (numbers, timeframes, results when possible)
- Use active voice
- Create urgency or desire without being pushy
- End with a clear benefit statement
- NO bullet points, NO emojis in the output
- Output ONLY the description text, nothing else.`;

    try {
        const stream = await geminiWithRetry(() => geminiStream(prompt));

        return new Response(stream, {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
    } catch (error) {
        console.error("AI Error:", error);
        return new Response("AI generation failed", { status: 500 });
    }
}
