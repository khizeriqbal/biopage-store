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

        const { productName, audience, emailGoal } = await req.json();

        if (!productName || !audience || !emailGoal) {
            return NextResponse.json(
                { error: "Missing required fields: productName, audience, emailGoal" },
                { status: 400 }
            );
        }

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Generate 5 different email subject lines and bodies for promoting a product.

Product: ${productName}
Target audience: ${audience}
Email goal: ${emailGoal} (curiosity/scarcity/value/social-proof/urgency)

Create 5 emails with DIFFERENT hooks/angles:
1. Curiosity hook - intrigue them with a question
2. Problem/solution hook - address their pain point
3. Scarcity/urgency hook - create urgency
4. Social proof hook - mention results/testimonials
5. Value hook - highlight main benefit

Requirements:
- Each email should be 3-5 sentences
- Conversational, human tone
- Include a clear CTA (link or button)
- Different hook for each email
- No corporate jargon or salesy language
- End with signature or closing

Format as JSON:
{
  "emails": [
    { "subject": "subject line", "body": "email body", "hook": "brief hook description" },
    { "subject": "subject line", "body": "email body", "hook": "brief hook description" },
    { "subject": "subject line", "body": "email body", "hook": "brief hook description" },
    { "subject": "subject line", "body": "email body", "hook": "brief hook description" },
    { "subject": "subject line", "body": "email body", "hook": "brief hook description" }
  ]
}`;

        const result = await model.generateContent(prompt);
        let text = result.response.text();

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Could not parse AI response as JSON");
        }

        const emails = JSON.parse(jsonMatch[0]);
        return NextResponse.json(emails);

    } catch (error) {
        console.error("Email generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate emails", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
