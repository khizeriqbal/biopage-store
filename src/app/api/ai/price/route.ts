import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { geminiComplete, geminiWithRetry } from "@/lib/gemini";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productType, niche, description } = await req.json();

    const prompt = `You are a pricing expert for digital creators. Suggest optimal pricing.

Product type: ${productType}
Creator niche: ${niche}
Description: ${description}

Based on market research and creator economy data, suggest a price.

Respond with ONLY valid JSON (no markdown, no code blocks, no explanation):
{
  "suggestedPrice": 47,
  "priceRange": { "min": 27, "max": 97 },
  "reasoning": "One clear sentence explaining why this price works",
  "comparison": "Similar products in this niche sell for $X-Y"
}`;

    try {
        const text = await geminiWithRetry(() => geminiComplete(prompt));

        // Clean any markdown formatting Gemini might add
        const clean = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const data = JSON.parse(clean);
        return NextResponse.json(data);
    } catch (error) {
        console.error("AI Price Suggestion Error:", error);
        // Fallback pricing if parsing fails
        const fallbacks: Record<string, any> = {
            DIGITAL: { suggestedPrice: 27, priceRange: { min: 9, max: 49 }, reasoning: "PDFs and templates typically sell for $9-49 in most niches.", comparison: "Similar digital downloads sell for $9-49" },
            COURSE: { suggestedPrice: 97, priceRange: { min: 47, max: 297 }, reasoning: "Online courses typically range from $47 for mini-courses to $297 for comprehensive programs.", comparison: "Similar courses sell for $47-297" },
            BOOKING: { suggestedPrice: 149, priceRange: { min: 75, max: 500 }, reasoning: "Coaching sessions typically range from $75-500/hour depending on niche and experience.", comparison: "Similar coaching sessions go for $75-500" },
            MEMBERSHIP: { suggestedPrice: 29, priceRange: { min: 9, max: 97 }, reasoning: "Monthly memberships typically range from $9-97 depending on value delivered.", comparison: "Similar memberships range from $9-97/month" },
        };
        return NextResponse.json(fallbacks[productType] || fallbacks.DIGITAL);
    }
}
