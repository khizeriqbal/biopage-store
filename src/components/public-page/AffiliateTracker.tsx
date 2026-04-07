"use client";

import { useEffect } from "react";

export function AffiliateTracker() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get("ref");
        if (!ref) return;

        // Store in cookie for checkout
        document.cookie = `affiliate_ref=${ref}; path=/; max-age=${60 * 60 * 24 * 30}`;

        // Track the click
        fetch("/api/affiliates/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: ref }),
        }).catch(() => {});
    }, []);

    return null;
}
