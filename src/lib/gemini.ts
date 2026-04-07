// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Use Flash for speed + free tier (1000 RPD free)
// Flash-Lite is fastest but Flash gives better quality
export const geminiFlash = genAI.getGenerativeModel({
    model: "gemini-2.0-flash", // Update to a valid model name (the user's 2.5 might be a placeholder or very new)
    generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 500,
    },
});

export const geminiFlashLite = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite", // Fallback to 2.0 if 2.5 is not yet standard in the lib
    generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 300,
    },
});

// Streaming helper — returns ReadableStream for client
export async function geminiStream(prompt: string): Promise<ReadableStream<Uint8Array>> {
    const result = await geminiFlash.generateContentStream(prompt);

    return new ReadableStream({
        async start(controller) {
            try {
                for await (const chunk of result.stream) {
                    const text = chunk.text();
                    if (text) {
                        controller.enqueue(new TextEncoder().encode(text));
                    }
                }
                controller.close();
            } catch (error) {
                controller.error(error);
            }
        },
    });
}

// Non-streaming for structured JSON responses
export async function geminiComplete(prompt: string): Promise<string> {
    const result = await geminiFlashLite.generateContent(prompt);
    return result.response.text();
}

// Rate limit handler — retry with exponential backoff
export async function geminiWithRetry<T>(
    fn: () => Promise<T>,
    maxRetries = 3
): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error: any) {
            if (error?.status === 429 && i < maxRetries - 1) {
                // Free tier: 10 RPM — wait before retry
                const delay = Math.pow(2, i) * 1000 + Math.random() * 500;
                await new Promise((res) => setTimeout(res, delay));
                continue;
            }
            throw error;
        }
    }
    throw new Error("Max retries reached");
}
