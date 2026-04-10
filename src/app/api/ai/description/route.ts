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

        const { title, type, niche, price, briefDescription } = await req.json();

        if (!title) {
            return NextResponse.json(
                { error: "Missing required field: title" },
                { status: 400 }
            );
        }

        const typeDescriptions: Record<string, string> = {
            DIGITAL: "digital download (PDF, template, or file)",
            COURSE: "online video course",
            BOOKING: "coaching or consulting session",
            MEMBERSHIP: "membership or subscription community",
            LEAD_MAGNET: "free resource in exchange for email signup",
        };

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Generate 3 different compelling product descriptions for:
Product: "${title}"
Type: ${typeDescriptions[type] || type}
Creator niche: ${niche || "content creation"}
Price: ${price === 0 ? "Free" : `$${price}`}
${briefDescription ? `Brief description: ${briefDescription}` : ""}

Requirements for EACH description:
- 3-5 sentences
- Start with OUTCOME/TRANSFORMATION the buyer gets (not features)
- Be specific and concrete (use numbers, timeframes, results when possible)
- Use active voice and power words
- Create desire without being pushy
- Include one specific benefit statement
- NO bullet points, NO emojis
- Different angle/hook for each description

Format as JSON:
{
  "descriptions": [
    { "text": "description 1", "hook": "brief hook/angle" },
    { "text": "description 2", "hook": "brief hook/angle" },
    { "text": "description 3", "hook": "brief hook/angle" }
  ]
}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Extract JSON from response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Could not parse AI response as JSON");
        }

        const descriptions = JSON.parse(jsonMatch[0]);
        return NextResponse.json(descriptions);

    } catch (error) {
        console.error("Description generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate descriptions", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
