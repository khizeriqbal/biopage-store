import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Hash } from "lucide-react";

interface Subscriber {
    id: string;
    name: string | null;
    email: string;
    source?: string | null; // e.g. "PRODUCT", "NEWSLETTER"
    createdAt: Date;
}

interface SubscribersTableProps {
    subscribers: Subscriber[];
}

export function SubscribersTable({ subscribers }: SubscribersTableProps) {
    return (
        <div className="rounded-xl border border-border bg-surface-raised/40 backdrop-blur-md overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                    Audience <Badge variant="outline" className="border-border text-muted-foreground text-[10px] uppercase font-bold px-2 py-0.5 ml-2">{subscribers.length}</Badge>
                </h3>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-border">
                            <TableHead className="text-muted-foreground font-medium py-4">
                                <span className="flex items-center gap-2"><User className="h-3 w-3" /> Name</span>
                            </TableHead>
                            <TableHead className="text-muted-foreground font-medium py-4">
                                <span className="flex items-center gap-2"><Mail className="h-3 w-3" /> Email</span>
                            </TableHead>
                            <TableHead className="text-muted-foreground font-medium py-4">
                                <span className="flex items-center gap-2"><Hash className="h-3 w-3" /> Source</span>
                            </TableHead>
                            <TableHead className="text-muted-foreground font-medium py-4">
                                <span className="flex items-center gap-2"><Calendar className="h-3 w-3" /> Subscribed on</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscribers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-20 text-muted-foreground italic font-medium">
                                    No subscribers yet. Share your link to start building your audience!
                                </TableCell>
                            </TableRow>
                        ) : (
                            subscribers.map((sub) => (
                                <TableRow key={sub.id} className="hover:bg-surface-hover/50 border-border group transition-all">
                                    <TableCell className="py-4 font-semibold text-white">
                                        {sub.name || <span className="text-muted-foreground italic opacity-40 font-normal">No name</span>}
                                    </TableCell>
                                    <TableCell className="py-4 text-muted-foreground group-hover:text-white transition-colors">{sub.email}</TableCell>
                                    <TableCell className="py-4">
                                        <Badge variant="outline" className="border-border text-[9px] uppercase font-bold tracking-widest leading-none bg-surface/30">
                                            {sub.source || "ORGANIC"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-4 text-muted-foreground">
                                        {format(new Date(sub.createdAt), "MMM d, yyyy HH:mm")}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
