import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { geminiStream, geminiWithRetry } from "@/lib/gemini";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { name, niche, products } = await req.json();

    const prompt = `Write a compelling, authentic creator bio for ${name || "this creator"}.
Niche: ${niche || "content creation"}
They sell: ${products?.length ? products.join(", ") : "digital products and services"}

Requirements:
- 2-3 sentences maximum
- First person voice ("I help...", "I create...")
- Specific to their niche — not generic
- Focus on who they help and what transformation they provide
- Sound human, warm, and confident
- NO hashtags, NO emojis, NO corporate speak
- Output ONLY the bio text, nothing else. No quotes, no intro, just the bio.`;

    try {
        const stream = await geminiWithRetry(() => geminiStream(prompt));

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "X-Content-Type-Options": "nosniff",
            },
        });
    } catch (error) {
        console.error("AI Error:", error);
        return new Response("AI generation failed", { status: 500 });
    }
}
