"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, TrendingUp } from "lucide-react";

interface AiPricingButtonProps {
  productType?: string;
  niche?: string;
  description?: string;
  onSelectPrice: (price: number) => void;
}

interface PricingData {
  suggestedPrice: number;
  priceRange: { min: number; max: number };
  reasoning: string;
  comparison: string;
  pricingTip?: string;
}

export function AiPricingButton({
  productType,
  niche,
  description,
  onSelectPrice,
}: AiPricingButtonProps) {
  const [loading, setLoading] = useState(false);
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [showing, setShowing] = useState(false);
  const [error, setError] = useState("");

  const generatePricing = async () => {
    if (!productType || !niche) {
      setError("Product type and niche are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productType: productType || "DIGITAL",
          niche: niche || "general",
          description: description || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate pricing");
      }

      const data = await response.json();
      setPricing(data);
      setShowing(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate pricing");
    } finally {
      setLoading(false);
    }
  };

  if (showing && pricing) {
    return (
      <div className="p-4 rounded-lg bg-brand/10 border border-brand/20 space-y-3">
        <p className="text-sm font-semibold text-white mb-4">AI Pricing Recommendation</p>

        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xs text-muted-foreground">Recommended Price</span>
              <span className="text-2xl font-bold text-brand">${pricing.suggestedPrice}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Price range: ${pricing.priceRange.min} - ${pricing.priceRange.max}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-brand font-semibold mb-1">Why this price?</p>
            <p className="text-sm text-white/80">{pricing.reasoning}</p>
          </div>

          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-brand font-semibold mb-1">Market Context</p>
            <p className="text-sm text-white/80">{pricing.comparison}</p>
          </div>

          {pricing.pricingTip && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-xs text-green-400 font-semibold mb-1">💡 Pro Tip</p>
              <p className="text-sm text-green-300/80">{pricing.pricingTip}</p>
            </div>
          )}
        </div>

        <Button
          size="sm"
          className="w-full bg-brand hover:bg-brand/90"
          onClick={() => {
            onSelectPrice(pricing.suggestedPrice);
            setShowing(false);
          }}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Use ${pricing.suggestedPrice}
        </Button>

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
        onClick={generatePricing}
        disabled={loading}
        variant="outline"
        className="border-brand text-brand hover:bg-brand/10 w-full"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Get AI Pricing
          </>
        )}
      </Button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
