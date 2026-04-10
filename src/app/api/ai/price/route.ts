import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        if (!process.env.GOOGLE_AI_API_KEY) {
            return NextResponse.json(
                { error: "Google AI API key not configured" },
                { status: 500 }
            );
        }

        const { productType, niche, description } = await req.json();

        if (!productType || !niche) {
            return NextResponse.json(
                { error: "Missing required fields: productType, niche" },
                { status: 400 }
            );
        }

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `You are a pricing expert for digital creators. Suggest optimal pricing based on market research.

Product type: ${productType}
Creator niche: ${niche}
${description ? `Description/details: ${description}` : ""}

Analyze market rates and suggest optimal pricing. Consider:
- Market rates for this product type in this niche
- Psychological pricing principles
- Value positioning
- Competition

Respond with ONLY valid JSON (no markdown, no code blocks):
{
  "suggestedPrice": number,
  "priceRange": { "min": number, "max": number },
  "reasoning": "brief explanation why this price point works",
  "comparison": "what similar products cost",
  "pricingTip": "one psychological pricing insight"
}`;

        const result = await model.generateContent(prompt);
        let text = result.response.text();

        // Clean any markdown formatting
        text = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const data = JSON.parse(text);
        return NextResponse.json(data);

    } catch (error) {
        console.error("AI Price Suggestion Error:", error);

        // Fallback pricing based on product type
        const fallbacks: Record<string, any> = {
            DIGITAL: {
                suggestedPrice: 27,
                priceRange: { min: 9, max: 49 },
                reasoning: "Digital products (templates, PDFs) typically sell best in the $9-49 range",
                comparison: "Similar digital products sell for $9-49",
                pricingTip: "Use charm pricing ($27 instead of $30)"
            },
            COURSE: {
                suggestedPrice: 97,
                priceRange: { min: 47, max: 297 },
                reasoning: "Online courses typically range from $47-297 depending on depth",
                comparison: "Similar courses sell for $47-297",
                pricingTip: "Price signifies quality - don't underprice"
            },
            COACHING: {
                suggestedPrice: 149,
                priceRange: { min: 75, max: 500 },
                reasoning: "Coaching sessions typically range $75-500 depending on niche",
                comparison: "Similar coaching sessions go for $75-500/hour",
                pricingTip: "Higher prices attract serious buyers"
            },
            MEMBERSHIP: {
                suggestedPrice: 29,
                priceRange: { min: 9, max: 97 },
                reasoning: "Monthly memberships typically range $9-97 depending on value",
                comparison: "Similar memberships range from $9-97/month",
                pricingTip: "Monthly pricing feels more accessible than annual"
            },
        };

        return NextResponse.json(fallbacks[productType] || fallbacks.DIGITAL);
    }
}
