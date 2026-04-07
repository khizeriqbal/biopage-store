"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const EMAIL_SWIPES = [
    {
        subject: "Subject: You're Leaving Money On The Table...",
        body: `Hi {"{FirstName}"},

I just discovered something that's changing how creators make money online.

bio page.store is a complete storefront that lets you:
✓ Sell digital products (courses, templates, presets)
✓ Set up affiliate programs for your audience
✓ Run email sequences automatically
✓ Track everything with built-in analytics

And the best part? You get your first 30 days FREE to test it out.

The creator making $30K/month I mentioned? She's using this exact system.

Here's your link → [YOUR_AFFILIATE_LINK]

Talk soon,
[Your Name]`,
    },
    {
        subject: "Subject: [PROOF] $4,200 In Sales (First Week)",
        body: `Hey {"{FirstName}"},

Remember how I said creators were making serious money with bio page.store?

Well, I just got my first week stats...

$4,200 in direct sales + $1,850 in affiliate commissions = $6,050

And I'm just getting started.

If you've ever wanted a simple way to monetize your audience without the headaches, this is it.

Check it out → [YOUR_AFFILIATE_LINK]

(Only available during the launch period)

Cheers,
[Your Name]`,
    },
    {
        subject: "Subject: Creator Dashboard That Actually Works",
        body: `Hi {"{FirstName}"},

Tired of juggling 5 different tools to run your digital business?

bio page.store combines everything:
→ Product sales page builder
→ Email automation
→ Affiliate program management
→ Revenue analytics

Plus you can add custom domains and white-label it if you want.

Limited time: Get lifetime access + all OTOs at launch price

[YOUR_AFFILIATE_LINK]

Best,
[Your Name]`,
    },
    {
        subject: "Subject: NOT Your Typical Launch...",
        body: `Hey {"{FirstName}"},

Most launches are hype and zero substance.

This one is different.

bio page.store actually solves the biggest problem creators face:
"How do I make money without sacrificing my time?"

The answer is: affiliate programs + email sequences + automated sales

30-day free trial → [YOUR_AFFILIATE_LINK]

No credit card. No BS. Just real results.

Talk soon,
[Your Name]`,
    },
    {
        subject: "Subject: Last Chance - Launch Pricing Ends Tomorrow",
        body: `Hi {"{FirstName}"},

This is your last email about this.

bio page.store launches tomorrow at 9 AM EST.

After that, the lifetime access deal goes away.

If you've been on the fence, this is the moment.

→ [YOUR_AFFILIATE_LINK]

The OTO bundle alone saves people $300+

Do it now before the price goes back up.

Talk soon,
[Your Name]`,
    },
];

export function EmailSwipes() {
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

    const copyToClipboard = (text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold text-white mb-2">📧 Email Swipes</h3>
                <p className="text-muted-foreground">
                    5 pre-written email templates. Copy, paste, customize with your name and affiliate link, and send!
                </p>
            </div>

            <div className="space-y-5">
                {EMAIL_SWIPES.map((email, idx) => (
                    <div key={idx} className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60 mb-1">
                                    Email #{idx + 1}
                                </p>
                                <p className="text-sm font-bold text-white break-words">{email.subject}</p>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(`${email.subject}\n\n${email.body}`, idx)}
                                className="shrink-0 border-border/50 text-xs"
                            >
                                {copiedIdx === idx ? (
                                    <CheckCircle2 className="h-3 w-3 text-green-400" />
                                ) : (
                                    <Copy className="h-3 w-3" />
                                )}
                                {copiedIdx === idx ? "Copied" : "Copy"}
                            </Button>
                        </div>

                        <div className="bg-black/30 rounded-lg p-4 text-[13px] text-white/80 max-h-40 overflow-y-auto font-mono leading-relaxed whitespace-pre-wrap break-words">
                            {email.body}
                        </div>

                        <p className="text-[10px] text-muted-foreground/60 mt-3">
                            💡 Replace [YOUR_AFFILIATE_LINK] with your unique tracking link
                        </p>
                    </div>
                ))}
            </div>

            <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
                <h4 className="font-bold text-white mb-3">Pro Tips</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Send these emails 1-2 days apart for maximum impact</li>
                    <li>• Personalize with the recipient's first name ({"{FirstName}"})</li>
                    <li>• Test subject lines - track which ones get the best open rates</li>
                    <li>• Include a P.S. with urgency if it's the final email</li>
                    <li>• Monitor your affiliate link clicks in the affiliate dashboard</li>
                </ul>
            </div>
        </div>
    );
}
