import { Metadata } from "next";
import { User } from "lucide-react";
import { JvPartnersTable } from "@/components/admin/JvPartnersTable";

export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
    title: "JV Partners | Admin Panel",
};

async function getJvPartners() {
    const partners = await prisma.jvPartner.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
    });

    return partners;
}

export default async function JvPartnersPage() {
    const partners = await getJvPartners();
    const approved = partners.filter(p => p.approved).length;
    const pending = partners.filter(p => !p.approved).length;

    return (
        <div className="space-y-8">
            {/* Header & Stats */}
            <div>
                <h1 className="text-3xl font-black text-white mb-6">JV Partners</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Total Applications</p>
                        <p className="text-3xl font-black text-white">{partners.length}</p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Approved</p>
                        <p className="text-3xl font-black text-green-400">{approved}</p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Pending Review</p>
                        <p className="text-3xl font-black text-yellow-400">{pending}</p>
                    </div>
                </div>
            </div>

            {/* Partners Table */}
            <JvPartnersTable partners={partners} />

            {partners.length === 0 && (
                <div className="text-center py-12">
                    <User className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">No JV partner applications found</p>
                </div>
            )}
        </div>
    );
}
