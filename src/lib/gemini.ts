// src/lib/gemini.ts
// Using Together.ai open-source models instead of Google Gemini
// API compatible - same functions, better for open-source

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const TOGETHER_API_URL = "https://api.together.xyz/v1/completions";

// Model selection
const FAST_MODEL = "meta-llama/Llama-2-7b-chat-hf"; // Fast, good quality
const LITE_MODEL = "togethercomputer/GPT-JT-6B"; // Smaller, faster

interface GenerativeModel {
    generateContent(prompt: string): Promise<{ response: { text(): string } }>;
    generateContentStream(prompt: string): Promise<{ stream: AsyncIterable<{ text(): string }> }>;
}

// Create model interface that matches Google's API
const createTogetherModel = (model: string, maxTokens: number): GenerativeModel => ({
    generateContent: async (prompt: string) => {
        const response = await fetchTogetherAI(model, prompt, maxTokens);
        return {
            response: {
                text: () => response
            }
        };
    },
    generateContentStream: async (prompt: string) => {
        const text = await fetchTogetherAI(model, prompt, maxTokens);
        return {
            stream: (async function* () {
                // Simulate streaming by yielding chunks
                let buffer = "";
                for (const char of text) {
                    buffer += char;
                    if (buffer.length >= 10) {
                        yield { text: () => buffer };
                        buffer = "";
                    }
                }
                if (buffer) {
                    yield { text: () => buffer };
                }
            })()
        };
    }
});

// Fetch from Together.ai API
async function fetchTogetherAI(model: string, prompt: string, maxTokens: number): Promise<string> {
    if (!TOGETHER_API_KEY) {
        throw new Error("TOGETHER_API_KEY is not set");
    }

    const response = await fetch(TOGETHER_API_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${TOGETHER_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model,
            prompt,
            max_tokens: maxTokens,
            temperature: 0.7,
            top_p: 0.9,
            top_k: 40,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Together.ai API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.output?.choices?.[0]?.text || data.choices?.[0]?.text || "";
}

// Models compatible with Google's interface
export const geminiFlash = createTogetherModel(FAST_MODEL, 500);
export const geminiFlashLite = createTogetherModel(LITE_MODEL, 300);

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
                // Together.ai has generous rate limits, but implement backoff just in case
                const delay = Math.pow(2, i) * 1000 + Math.random() * 500;
                await new Promise((res) => setTimeout(res, delay));
                continue;
            }
            throw error;
        }
    }
    throw new Error("Max retries reached");
}
