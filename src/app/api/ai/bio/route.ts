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

        const { niche, style, achievements } = await req.json();

        if (!niche || !style) {
            return NextResponse.json(
                { error: "Missing required fields: niche, style" },
                { status: 400 }
            );
        }

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Generate 3 different creator bios for someone in the ${niche} niche.
Style: ${style} (choose from: professional, casual, witty)
${achievements ? `Their key achievements or info: ${achievements}` : ""}

Requirements for each bio:
- 150-300 characters
- Compelling and conversion-focused
- Uses first-person voice ("I help...", "I create...")
- Specific to their niche
- Includes value proposition
- Sound human and confident
- NO hashtags, NO emojis, NO corporate jargon

Format as JSON:
{
  "bios": [
    { "text": "bio 1 text here", "length": number },
    { "text": "bio 2 text here", "length": number },
    { "text": "bio 3 text here", "length": number }
  ]
}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Extract JSON from response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Could not parse AI response as JSON");
        }

        const bios = JSON.parse(jsonMatch[0]);
        return NextResponse.json(bios);

    } catch (error) {
        console.error("Bio generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate bios", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
