"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Copy } from "lucide-react";

interface AiEmailButtonProps {
  productName: string;
  audience?: string;
  emailGoal?: "curiosity" | "scarcity" | "value" | "social-proof" | "urgency";
  onSelectEmail?: (subject: string, body: string) => void;
}

interface Email {
  subject: string;
  body: string;
  hook?: string;
}

export function AiEmailButton({
  productName,
  audience,
  emailGoal,
  onSelectEmail,
}: AiEmailButtonProps) {
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState<Email[]>([]);
  const [showing, setShowing] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const generateEmails = async () => {
    if (!productName || !audience || !emailGoal) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          audience: audience || "general audience",
          emailGoal: emailGoal || "curiosity",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate emails");
      }

      const data = await response.json();
      setEmails(data.emails || []);
      setShowing(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate emails");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  if (showing && emails.length > 0) {
    return (
      <div className="p-4 rounded-lg bg-brand/10 border border-brand/20 space-y-3">
        <p className="text-sm font-semibold text-white">AI-Generated Email Copy:</p>
        {emails.map((email, idx) => (
          <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
            {email.hook && (
              <p className="text-xs text-brand font-semibold">Hook: {email.hook}</p>
            )}
            <div>
              <p className="text-xs text-muted-foreground font-semibold mb-1">Subject:</p>
              <p className="text-sm text-white/80">{email.subject}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold mb-1">Body:</p>
              <p className="text-sm text-white/80 whitespace-pre-wrap">{email.body}</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-brand text-brand hover:bg-brand/10"
                onClick={() => {
                  onSelectEmail?.(email.subject, email.body);
                  setShowing(false);
                }}
              >
                Use This Email
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-brand text-brand hover:bg-brand/10"
                onClick={() =>
                  copyToClipboard(`Subject: ${email.subject}\n\n${email.body}`, `email-${idx}`)
                }
              >
                <Copy className="w-3 h-3 mr-1" />
                {copied === `email-${idx}` ? "Copied!" : "Copy"}
              </Button>
            </div>
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
        onClick={generateEmails}
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
            Generate Email Copy
          </>
        )}
      </Button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
