import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Award, Zap, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Become an Affiliate | bio page.store",
    description: "Join our affiliate program and earn recurring commissions. 100% on FE + 50% on 4 high-converting upsells.",
};

export default function AffiliatesPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-surface-raised/50 px-4 py-2 mb-6">
                        <Zap className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">Join 500+ Affiliate Partners</span>
                    </div>

                    <h1 className="text-4xl font-black text-white mb-4 sm:text-5xl lg:text-6xl">
                        Earn <span className="text-blue-400">$2+ per click</span> Promoting bio page.store
                    </h1>

                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        100% commission on the front end ($17 per sale) + 50% recurring on 4 upsells.
                        Promote a product that actually converts and builds lasting relationships.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button className="h-12 px-8 text-base font-semibold" size="lg">
                            Apply Now
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                        <Button variant="outline" className="h-12 px-8 text-base font-semibold" size="lg">
                            See Promotion Materials
                        </Button>
                    </div>
                </div>

                {/* Floating Cards Background */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
                </div>
            </section>

            {/* Why Join Section */}
            <section className="px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <h2 className="text-3xl font-black text-white mb-12 text-center">Why Affiliates Love bio page.store</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="rounded-xl border border-border/50 bg-surface-raised/50 backdrop-blur-sm p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <TrendingUp className="h-6 w-6 text-green-400" />
                                <h3 className="text-lg font-bold text-white">100% Front-End Commission</h3>
                            </div>
                            <p className="text-muted-foreground mb-4">
                                Keep every dollar on the initial sale. No split. No percentage cut. You earn $17 per customer signup.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                                    <span>$17 per sale (guaranteed 100%)</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                                    <span>Instant payout to affiliate account</span>
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-xl border border-border/50 bg-surface-raised/50 backdrop-blur-sm p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Zap className="h-6 w-6 text-yellow-400" />
                                <h3 className="text-lg font-bold text-white">High-Converting Product</h3>
                            </div>
                            <p className="text-muted-foreground mb-4">
                                bio page.store converts at 3-5% because it genuinely solves creator problems. Built-in proof with AI that converts cold traffic.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                                    <span>Tested sales page & VSL</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                                    <span>3-5% conversion rate proven</span>
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-xl border border-border/50 bg-surface-raised/50 backdrop-blur-sm p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Award className="h-6 w-6 text-purple-400" />
                                <h3 className="text-lg font-bold text-white">50% Recurring Revenue</h3>
                            </div>
                            <p className="text-muted-foreground mb-4">
                                Customers don't just buy once. They upgrade to Pro ($9/mo), Templates ($27), Agency ($67), and Reseller ($197).
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-purple-400" />
                                    <span>50% on all 4 upsells</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-purple-400" />
                                    <span>Average cart value: $65+</span>
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-xl border border-border/50 bg-surface-raised/50 backdrop-blur-sm p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Users className="h-6 w-6 text-blue-400" />
                                <h3 className="text-lg font-bold text-white">Creator-First Audience</h3>
                            </div>
                            <p className="text-muted-foreground mb-4">
                                Hot niche with laser-focused buyers. Creators, influencers, and side hustlers actively looking for tools.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-blue-400" />
                                    <span>$2+ average EPC</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-blue-400" />
                                    <span>List-friendly + cold traffic ready</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Commissions & Payouts */}
            <section className="px-4 py-16 sm:px-6 lg:px-8 bg-surface-raised/20 backdrop-blur-sm">
                <div className="mx-auto max-w-5xl">
                    <h2 className="text-3xl font-black text-white mb-12 text-center">Earn on Every Level</h2>

                    <div className="space-y-4">
                        {[
                            { level: "Front End (FE)", price: "$17", commission: "100%", earnings: "$17" },
                            { level: "OTO 1: Creator Pro", price: "$37", commission: "50%", earnings: "$18.50" },
                            { level: "OTO 2: DFY Templates", price: "$27", commission: "50%", earnings: "$13.50" },
                            { level: "OTO 3: Agency License", price: "$67", commission: "50%", earnings: "$33.50" },
                            { level: "OTO 4: Reseller Rights", price: "$197", commission: "50%", earnings: "$98.50" },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between rounded-lg border border-border/30 bg-black/30 px-6 py-4"
                            >
                                <div>
                                    <h3 className="font-semibold text-white">{item.level}</h3>
                                    <p className="text-sm text-muted-foreground">{item.price}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-yellow-400">{item.commission}</p>
                                    <p className="text-sm text-muted-foreground">You earn {item.earnings}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 rounded-xl border border-border/50 bg-green-500/10 backdrop-blur-sm p-6">
                        <p className="text-center text-white">
                            <strong>Average cart value: $65+</strong> | Projected EPC: <strong>$2.40</strong>
                        </p>
                    </div>
                </div>
            </section>

            {/* Email Swipes */}
            <section className="px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <h2 className="text-3xl font-black text-white mb-12 text-center">Pre-Written Email Swipes</h2>
                    <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                        Done-for-you email templates. Just copy, paste into your list, and collect commissions.
                    </p>

                    <div className="space-y-6">
                        {[
                            {
                                title: "Curiosity Hook",
                                preview: "Why are 10,000 creators switching to THIS link-in-bio tool?"
                            },
                            {
                                title: "Problem/Solution",
                                preview: "Stan.store charges 5%… this platform charges ZERO"
                            },
                            {
                                title: "Urgency Play",
                                preview: "Price goes up at midnight — last chance for $17"
                            },
                            {
                                title: "Feature-Focused",
                                preview: "AI writes your bio, Whop handles payments, you keep 95%"
                            },
                            {
                                title: "Story-Driven",
                                preview: "She made $4,200 in 30 days with ONE link. Here's how."
                            },
                        ].map((email, i) => (
                            <div
                                key={i}
                                className="rounded-xl border border-border/50 bg-surface-raised/50 backdrop-blur-sm p-6"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white mb-2">{email.title}</h3>
                                        <p className="text-muted-foreground italic">"{email.preview}"</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-9 px-4 flex-shrink-0">
                                        Copy
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-500/10 to-transparent">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-black text-white mb-4 sm:text-4xl">Ready to Start Earning?</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Join 500+ affiliates making $500-$5,000+/month promoting bio page.store
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="h-12 px-8 text-base font-semibold" size="lg">
                            Apply to Affiliate Program
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                        <Button variant="outline" className="h-12 px-8 text-base font-semibold" size="lg">
                            Download Media Kit
                        </Button>
                    </div>

                    <div className="mt-12 flex flex-wrap justify-center gap-8">
                        <div className="text-center">
                            <p className="text-2xl font-black text-yellow-400">500+</p>
                            <p className="text-sm text-muted-foreground">Active Affiliates</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black text-green-400">$2.40</p>
                            <p className="text-sm text-muted-foreground">Average EPC</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black text-purple-400">50%</p>
                            <p className="text-sm text-muted-foreground">Recurring Commission</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
