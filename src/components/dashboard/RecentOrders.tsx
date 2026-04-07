import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Order {
    id: string;
    product: { title: string };
    buyerEmail: string;
    amount: number;
    createdAt: Date;
    status: string;
}

interface RecentOrdersProps {
    orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
    return (
        <div className="rounded-xl border border-border bg-surface-raised/40 backdrop-blur-md overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-base font-semibold text-white tracking-tight">Recent Orders</h3>
                <Badge variant="outline" className="border-border text-muted-foreground text-[10px] uppercase font-bold px-2 py-0.5">
                    {orders.length} TOTAL
                </Badge>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-border">
                            <TableHead className="text-muted-foreground font-medium py-4">Product</TableHead>
                            <TableHead className="text-muted-foreground font-medium py-4">Buyer</TableHead>
                            <TableHead className="text-muted-foreground font-medium py-4">Amount</TableHead>
                            <TableHead className="text-muted-foreground font-medium py-4">Date</TableHead>
                            <TableHead className="text-muted-foreground font-medium py-4">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">
                                    No orders yet. Start selling to see them here!
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id} className="hover:bg-surface-hover/50 border-border group transition-all">
                                    <TableCell className="py-4 font-medium text-white">{order.product.title}</TableCell>
                                    <TableCell className="py-4 text-muted-foreground">{order.buyerEmail}</TableCell>
                                    <TableCell className="py-4 font-bold text-accent">{formatPrice(order.amount)}</TableCell>
                                    <TableCell className="py-4 text-muted-foreground">{format(new Date(order.createdAt), "MMM d, HH:mm")}</TableCell>
                                    <TableCell className="py-4">
                                        <Badge className={cn(
                                            "text-[10px] font-bold uppercase py-0 px-2 h-5 rounded-full",
                                            order.status === "COMPLETED" ? "bg-accent/15 text-accent border border-accent/20" :
                                                order.status === "PENDING" ? "bg-yellow-500/15 text-yellow-500 border border-yellow-500/20" :
                                                    "bg-destructive/15 text-destructive border border-destructive/20"
                                        )}>
                                            {order.status}
                                        </Badge>
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

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");
