"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface AiDescribeButtonProps {
  productTitle: string;
  productType?: string;
  niche?: string;
  price?: number;
  briefDescription?: string;
  onSelectDescription: (description: string) => void;
}

interface Description {
  text: string;
  hook?: string;
}

export function AiDescribeButton({
  productTitle,
  productType,
  niche,
  price,
  briefDescription,
  onSelectDescription,
}: AiDescribeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [descriptions, setDescriptions] = useState<Description[]>([]);
  const [showing, setShowing] = useState(false);
  const [error, setError] = useState("");

  const generateDescriptions = async () => {
    if (!productTitle) {
      setError("Product title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai/description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: productTitle,
          type: productType || "DIGITAL",
          niche: niche || "general",
          price: price || 0,
          briefDescription: briefDescription || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate descriptions");
      }

      const data = await response.json();
      setDescriptions(data.descriptions || []);
      setShowing(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate descriptions");
    } finally {
      setLoading(false);
    }
  };

  if (showing && descriptions.length > 0) {
    return (
      <div className="p-4 rounded-lg bg-brand/10 border border-brand/20 space-y-3">
        <p className="text-sm font-semibold text-white">AI-Generated Descriptions:</p>
        {descriptions.map((desc, idx) => (
          <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10">
            {desc.hook && (
              <p className="text-xs text-brand font-semibold mb-1">Angle: {desc.hook}</p>
            )}
            <p className="text-sm text-white/80 mb-2">{desc.text}</p>
            <Button
              size="sm"
              variant="outline"
              className="border-brand text-brand hover:bg-brand/10 w-full"
              onClick={() => {
                onSelectDescription(desc.text);
                setShowing(false);
              }}
            >
              Use This Description
            </Button>
          </div>
        ))}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowing(false)}
          className="w-full text-muted-foreground hover:text-white"
        >
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={generateDescriptions}
        disabled={loading}
        variant="outline"
        className="border-brand text-brand hover:bg-brand/10 w-full"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate with AI
          </>
        )}
      </Button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
