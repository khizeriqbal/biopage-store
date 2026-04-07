"use client";

import { Mail, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function JvContact() {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold text-white mb-2">📞 JV Manager Contact</h3>
                <p className="text-muted-foreground">
                    Have questions? Want to negotiate custom terms? Reach out directly to our JV manager.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Email */}
                <a
                    href="mailto:jv@biopage.store"
                    className="group rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-brand/50 hover:bg-surface-raised"
                >
                    <div className="h-12 w-12 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                        <Mail className="h-6 w-6 text-brand" />
                    </div>
                    <h4 className="font-bold text-white mb-1">Email</h4>
                    <p className="text-sm text-muted-foreground mb-4 break-all">jv@biopage.store</p>
                    <Button variant="ghost" size="sm" className="h-8 px-0 text-brand hover:bg-transparent hover:text-brand/80">
                        Send Email →
                    </Button>
                </a>

                {/* Skype */}
                <a
                    href="skype:biopage.jv?chat"
                    className="group rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-surface-raised"
                >
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                        <MessageSquare className="h-6 w-6 text-blue-400" />
                    </div>
                    <h4 className="font-bold text-white mb-1">Skype</h4>
                    <p className="text-sm text-muted-foreground mb-4">biopage.jv</p>
                    <Button variant="ghost" size="sm" className="h-8 px-0 text-blue-400 hover:bg-transparent hover:text-blue-300">
                        Open Skype →
                    </Button>
                </a>

                {/* Response Time */}
                <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
                    <div className="h-12 w-12 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center mb-4">
                        <Phone className="h-6 w-6 text-accent" />
                    </div>
                    <h4 className="font-bold text-white mb-1">Response Time</h4>
                    <p className="text-sm text-muted-foreground">
                        Typically responds within 2-4 hours during business hours (EST).
                    </p>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-8 backdrop-blur-sm space-y-6">
                <h4 className="text-lg font-bold text-white">Common Questions</h4>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <h5 className="font-semibold text-white text-sm">
                            Do you accept custom commission rates?
                        </h5>
                        <p className="text-sm text-muted-foreground">
                            Yes! If you have a list of 50K+ and want to promote heavily, we can negotiate higher commissions or hybrid deals. Contact the JV manager.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h5 className="font-semibold text-white text-sm">
                            What's the refund policy for affiliates?
                        </h5>
                        <p className="text-sm text-muted-foreground">
                            Affiliates are paid on sales that result in charged subscriptions. If a customer cancels within 30 days, that commission is reversed.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h5 className="font-semibold text-white text-sm">
                            When do I get paid?
                        </h5>
                        <p className="text-sm text-muted-foreground">
                            Commissions are calculated daily and paid out monthly via PayPal on the 15th of each month for the previous month's sales.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h5 className="font-semibold text-white text-sm">
                            Can I negotiate a longer launch period?
                        </h5>
                        <p className="text-sm text-muted-foreground">
                            Absolutely. Reach out to the JV manager if you want to extend your promotion period beyond the standard timeline.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h5 className="font-semibold text-white text-sm">
                            Do you have API access for tracking?
                        </h5>
                        <p className="text-sm text-muted-foreground">
                            Yes, we offer API access for advanced affiliates who want to build custom dashboards or integrate tracking with their CRM.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
