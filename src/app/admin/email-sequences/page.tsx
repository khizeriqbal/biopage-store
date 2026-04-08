import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Mail, ToggleRight, Calendar, Zap } from "lucide-react";

export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
    title: "Email Sequences | Admin Panel",
};

async function getEmailSequences() {
    const sequences = await prisma.emailSequence.findMany({
        select: {
            id: true,
            name: true,
            active: true,
            createdAt: true,
            trigger: true,
            _count: {
                select: {
                    steps: true,
                    enrollments: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return sequences;
}

export default async function EmailSequencesPage() {
    const sequences = await getEmailSequences();
    const active = sequences.filter(s => s.active).length;

    return (
        <div className="space-y-8">
            {/* Header & Stats */}
            <div>
                <h1 className="text-3xl font-black text-white mb-6">Email Sequences</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Total Sequences</p>
                        <p className="text-3xl font-black text-white">{sequences.length}</p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Active</p>
                        <p className="text-3xl font-black text-green-400">{active}</p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                        <p className="text-muted-foreground text-sm mb-2">Total Enrollments</p>
                        <p className="text-3xl font-black text-blue-400">
                            {sequences.reduce((sum, s) => sum + s._count.enrollments, 0)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Sequences Table */}
            <div className="rounded-xl border border-border/50 bg-surface-raised/50 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/30 bg-black/30">
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Sequence Name
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Trigger
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Steps
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Enrollments
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Created
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {sequences.map((seq) => (
                                <tr key={seq.id} className="hover:bg-black/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                                            <span className="text-sm font-semibold text-white">{seq.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold px-2 py-1 rounded bg-purple-500/20 text-purple-300">
                                            {seq.trigger === "POST_PURCHASE" ? "Post-Purchase" : seq.trigger}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-sm text-white/80">
                                            <Zap className="h-3 w-3" />
                                            {seq._count.steps}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-white/80">{seq._count.enrollments}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-white/80 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(seq.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${seq.active ? "bg-green-500" : "bg-red-500"}`} />
                                            <span className="text-xs font-bold text-white/80">
                                                {seq.active ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Button size="sm" variant="outline" className="h-8 text-xs">
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {sequences.length === 0 && (
                <div className="text-center py-12">
                    <Mail className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">No email sequences found</p>
                </div>
            )}
        </div>
    );
}
