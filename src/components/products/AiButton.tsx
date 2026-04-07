"use client";

import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AiButtonProps {
    label?: string;
    endpoint: "/api/ai/bio" | "/api/ai/description" | "/api/ai/price";
    payload: any;
    onStream?: (chunk: string) => void;
    onComplete?: (fullText: string) => void;
    onData?: (data: any) => void;
    className?: string;
    variant?: "brand" | "accent" | "outline" | "ghost" | "default";
    size?: "sm" | "md" | "lg" | "icon";
}

export function AiButton({
    label = "Write with AI",
    endpoint,
    payload,
    onStream,
    onComplete,
    onData,
    className,
    variant = "brand",
    size = "sm"
}: AiButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(endpoint, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("AI failed");

            if (endpoint === "/api/ai/price") {
                const data = await res.json();
                onData?.(data);
                setIsLoading(false);
                return;
            }

            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            let fullText = "";

            if (reader) {
                onStream?.(""); // Clear target
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value);
                    fullText += chunk;
                    onStream?.(chunk);
                }
                onComplete?.(fullText);
            }
        } catch (err) {
            toast.error("AI unavailable, try again");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            type="button"
            onClick={handleClick}
            disabled={isLoading}
            variant={variant === "brand" ? "secondary" : variant === "accent" ? "secondary" : "default"}
            className={cn(
                "gap-2 font-semibold transition-all group",
                variant === "brand" && "bg-brand/10 text-brand hover:bg-brand/20 border border-brand/20",
                variant === "accent" && "bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20",
                className
            )}
            size={size === "md" ? "default" : size}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
                <Sparkles className="h-4 w-4 text-brand animate-pulse group-hover:scale-125 transition-transform" />
            )}
            {size !== "icon" && <span>{label}</span>}
        </Button>
    );
}
