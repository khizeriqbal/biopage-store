import { Metadata } from "next";
import { Search, Filter, Shield, AlertCircle, Mail, Trash2, User, DollarSign, Calendar, Activity, Lock, CheckCircle2, Clock } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "User Management | Admin Panel",
};

async function getUsers(search?: string, status?: string) {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                username: true,
                role: true,
                suspendedAt: true,
                createdAt: true,
            },
            where: {
                AND: [
                    search ? {
                        OR: [
                            { email: { contains: search, mode: "insensitive" } },
                            { username: { contains: search, mode: "insensitive" } },
                        ]
                    } : {},
                    status === 'suspended' ? { suspendedAt: { not: null } } : {},
                    status === 'active' ? { suspendedAt: null } : {},
                ]
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        });

        // Get additional stats per user
        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                const [orderCount, productCount, totalSpent] = await Promise.all([
                    prisma.order.count({ where: { userId: user.id } }),
                    prisma.product.count({ where: { userId: user.id } }),
                    prisma.order.aggregate({
                        where: { userId: user.id },
                        _sum: { amount: true }
                    })
                ]);

                return {
                    ...user,
                    orderCount,
                    productCount,
                    totalSpent: totalSpent._sum.amount || 0,
                };
            })
        );

        return usersWithStats;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export default async function UserManagementPage() {
    const users = await getUsers();

    const activeUsers = users.filter(u => !u.suspendedAt).length;
    const suspendedUsers = users.filter(u => u.suspendedAt).length;
    const adminUsers = users.filter(u => u.role === 'admin' || u.role === 'superadmin').length;
    const totalRevenue = users.reduce((sum, u) => sum + u.totalSpent, 0);

    return (
        <div className="space-y-8 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white mb-2">User Management</h1>
                <p className="text-muted-foreground">Manage all registered creators and users</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card-modern">
                    <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                    <h3 className="text-3xl font-black text-white">{users.length}</h3>
                    <p className="text-xs text-blue-400 mt-2">All creators</p>
                </div>

                <div className="card-modern">
                    <p className="text-sm text-muted-foreground mb-1">Active Users</p>
                    <h3 className="text-3xl font-black text-emerald-400">{activeUsers}</h3>
                    <p className="text-xs text-emerald-400 mt-2">Currently active</p>
                </div>

                <div className="card-modern border-yellow-500/30">
                    <p className="text-sm text-muted-foreground mb-1">Suspended</p>
                    <h3 className="text-3xl font-black text-yellow-400">{suspendedUsers}</h3>
                    <p className="text-xs text-yellow-400 mt-2">Accounts suspended</p>
                </div>

                <div className="card-modern">
                    <p className="text-sm text-muted-foreground mb-1">Admin Users</p>
                    <h3 className="text-3xl font-black text-purple-400">{adminUsers}</h3>
                    <p className="text-xs text-purple-400 mt-2">Admin accounts</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="card-modern space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by email or username..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-muted-foreground focus:outline-none focus:border-blue-400/50 transition"
                        />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition text-sm font-semibold">
                            <Filter className="h-4 w-4 inline mr-2" />
                            All Users
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-slate-700/20 border border-white/10 text-white hover:bg-slate-700/40 transition text-sm font-semibold">
                            Active
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-slate-700/20 border border-white/10 text-white hover:bg-slate-700/40 transition text-sm font-semibold">
                            Suspended
                        </button>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="card-modern overflow-hidden">
                <h3 className="font-bold text-white text-lg mb-4">Users</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10 bg-slate-800/50">
                                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">User</th>
                                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Role</th>
                                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Revenue</th>
                                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Products</th>
                                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Status</th>
                                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Joined</th>
                                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-blue-purple flex items-center justify-center">
                                                    <User className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">{user.username || 'Unnamed'}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                                                user.role === 'superadmin' ? 'bg-red-500/20 text-red-400' :
                                                user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                                                'bg-slate-700/40 text-white/70'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="h-4 w-4 text-emerald-400" />
                                                <span className="font-semibold text-emerald-400">${user.totalSpent.toFixed(2)}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-white">{user.productCount}</td>
                                        <td className="py-4 px-4">
                                            {user.suspendedAt ? (
                                                <div className="flex items-center gap-1">
                                                    <Lock className="h-4 w-4 text-red-400" />
                                                    <span className="text-xs font-bold text-red-400">Suspended</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                                    <span className="text-xs font-bold text-emerald-400">Active</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-muted-foreground text-xs">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex gap-2">
                                                <button className="p-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition">
                                                    <Activity className="h-4 w-4" />
                                                </button>
                                                <button className="p-1.5 rounded-lg bg-slate-700/20 border border-white/10 text-white hover:bg-slate-700/40 transition">
                                                    <Mail className="h-4 w-4" />
                                                </button>
                                                <button className="p-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bulk Actions Panel */}
            <div className="card-modern border-purple-500/30 bg-purple-500/5">
                <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-5 w-5 text-purple-400" />
                    <h3 className="font-bold text-white">Bulk Actions</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button className="px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition text-sm font-semibold">
                        Suspend Selected
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition text-sm font-semibold">
                        Activate Selected
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition text-sm font-semibold">
                        Promote to Admin
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-slate-700/20 border border-white/10 text-white hover:bg-slate-700/40 transition text-sm font-semibold">
                        Export Data
                    </button>
                </div>
            </div>
        </div>
    );
}
