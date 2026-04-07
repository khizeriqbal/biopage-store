import { Metadata } from "next";
import { JvHero } from "./components/JvHero";
import { JvWhyPromote } from "./components/JvWhyPromote";
import { FunnelDiagram } from "./components/FunnelDiagram";
import { AffiliateStats } from "./components/AffiliateStats";
import { PrizeContest } from "./components/PrizeContest";
import { JvSignupForm } from "./components/JvSignupForm";
import { EmailSwipes } from "./components/EmailSwipes";
import { SocialSwipes } from "./components/SocialSwipes";
import { BannerSection } from "./components/BannerSection";
import { JvContact } from "./components/JvContact";

export const metadata: Metadata = {
    title: "JV Partner Page | bio page.store — 100% Commission Launch",
    description: "Join the bio page.store affiliate launch. Earn 100% on the front end + 50% on 4 upsells. $2+ EPC. Get your affiliate link, email swipes, and banners here.",
    robots: "noindex",
};

// Launch date: 14 days from now — update this to your actual launch date
export const LAUNCH_DATE = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
export const JV_MANAGER_EMAIL = "jv@biopage.store";
export const JV_MANAGER_SKYPE = "live:jv.biopage";
export const WARRIORPLUS_LINK = "https://warriorplus.com/o2/a/biopage/0";
export const JVZOO_LINK = "https://www.jvzoo.com/affiliate/affiliateinfopage?pid=BIOPAGE";

export default function JvPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-[#5C4EFA] selection:text-white font-sans">
            {/* Top bar */}
            <div className="bg-[#5C4EFA] text-white text-center py-2.5 text-sm font-bold tracking-wide">
                🚀 LAUNCH OPENS IN 14 DAYS — Secure Your Affiliate Link NOW Before We Cap Partners
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-0">
                <JvHero launchDate={LAUNCH_DATE} warriorplusLink={WARRIORPLUS_LINK} jvzooLink={JVZOO_LINK} />
                <JvWhyPromote />
                <AffiliateStats />
                <FunnelDiagram />
                <PrizeContest />
                <JvSignupForm />
                <EmailSwipes />
                <SocialSwipes />
                <BannerSection />
                <JvContact />
            </div>

            <footer className="border-t border-white/10 mt-20 py-8 text-center text-sm text-white/30">
                © 2025 bio page.store · All Rights Reserved · <a href="/privacy" className="hover:text-white/60">Privacy Policy</a> · <a href="/terms" className="hover:text-white/60">Terms</a>
            </footer>
        </div>
    );
}
