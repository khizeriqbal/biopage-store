"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface AiBioButtonProps {
  niche: string;
  style: "professional" | "casual" | "witty";
  achievements?: string;
  onSelectBio: (bio: string) => void;
}

interface Bio {
  text: string;
  length?: number;
}

export function AiBioButton({ niche, style, achievements, onSelectBio }: AiBioButtonProps) {
  const [loading, setLoading] = useState(false);
  const [bios, setBios] = useState<Bio[]>([]);
  const [showing, setShowing] = useState(false);
  const [error, setError] = useState("");

  const generateBios = async () => {
    if (!niche || !style) {
      setError("Please select both niche and style");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche,
          style,
          achievements: achievements || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate bios");
      }

      const data = await response.json();
      setBios(data.bios || []);
      setShowing(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate bios");
    } finally {
      setLoading(false);
    }
  };

  if (showing && bios.length > 0) {
    return (
      <div className="p-4 rounded-lg bg-brand/10 border border-brand/20 space-y-3">
        <p className="text-sm font-semibold text-white">AI-Generated Bio Options:</p>
        {bios.map((bio, idx) => (
          <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-sm text-white/80 mb-2">{bio.text}</p>
            <Button
              size="sm"
              variant="outline"
              className="border-brand text-brand hover:bg-brand/10 w-full"
              onClick={() => {
                onSelectBio(bio.text);
                setShowing(false);
              }}
            >
              Use This Bio
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
        onClick={generateBios}
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
