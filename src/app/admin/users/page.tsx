import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, TrendingUp, Lock } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
    title: "Users | Admin Panel",
};

async function getUsers() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            username: true,
            plan: true,
            createdAt: true,
            _count: {
                select: {
                    products: true,
                    orders: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
    });

    return users;
}

export default async function UsersPage() {
    const users = await getUsers();

    const getPlanColor = (plan: string) => {
        switch (plan) {
            case "FREE":
                return "bg-slate-500/20 text-slate-300";
            case "STARTER":
                return "bg-blue-500/20 text-blue-300";
            case "PRO":
                return "bg-purple-500/20 text-purple-300";
            default:
                return "bg-gray-500/20 text-gray-300";
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">Users</h1>
                    <p className="text-muted-foreground">
                        {users.length} registered creators
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border/50 bg-surface-raised/50 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/30 bg-black/30">
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Username
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Plan
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Products
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Orders
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Joined
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-black/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground/50" />
                                            <a href={`mailto:${user.email}`} className="text-sm text-white hover:text-brand transition-colors">
                                                {user.email}
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-white/80">@{user.username || "—"}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${getPlanColor(user.plan)}`}>
                                            {user.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-white/80 flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3" />
                                            {user._count.products}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-white/80">{user._count.orders}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-white/80 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/admin/users/${user.id}`}>
                                            <Button size="sm" variant="outline" className="h-8 text-xs">
                                                View
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {users.length === 0 && (
                <div className="text-center py-12">
                    <Lock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">No users found</p>
                </div>
            )}
        </div>
    );
}
