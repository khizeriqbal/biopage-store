"use client";

import { useEffect } from "react";

export function AnalyticsTracker({ userId }: { userId: string }) {
    useEffect(() => {
        // Only track once per page load to avoid spamming
        const track = async () => {
            try {
                await fetch("/api/analytics/track", {
                    method: "POST",
                    body: JSON.stringify({ userId, type: "pageview" }),
                });
            } catch (err) {
                console.error("Tracking Error:", err);
            }
        };

        // Slight delay to avoid blocking important content
        const timeout = setTimeout(track, 1500);
        return () => clearTimeout(timeout);
    }, [userId]);

    return null;
}
