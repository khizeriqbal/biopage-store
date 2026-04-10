import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Mail, User, Calendar, Package, ShoppingCart, TrendingUp, Lock } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
    title: "User Details | Admin Panel",
};

async function getUser(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            username: true,
            plan: true,
            createdAt: true,
            updatedAt: true,
            customDomain: true,
            domainVerified: true,
            bio: true,
            niche: true,
            avatar: true,
            _count: {
                select: {
                    products: true,
                    orders: true,
                    affiliateLinks: true,
                },
            },
        },
    });

    return user;
}

export default async function UserDetailPage({
    params: { userId },
}: {
    params: { userId: string };
}) {
    const user = await getUser(userId);

    if (!user) {
        notFound();
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">{user.name || user.email}</h1>
                    <p className="text-muted-foreground">@{user.username}</p>
                </div>
                <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                        user.plan === "PRO" ? "bg-purple-500/20 text-purple-300" :
                        user.plan === "STARTER" ? "bg-blue-500/20 text-blue-300" :
                        "bg-slate-500/20 text-slate-300"
                    }`}>
                        {user.plan}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                    <p className="text-muted-foreground text-sm mb-2">Products</p>
                    <p className="text-3xl font-black text-white flex items-center gap-2">
                        <Package className="h-6 w-6 text-brand" />
                        {user._count.products}
                    </p>
                </div>
                <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                    <p className="text-muted-foreground text-sm mb-2">Orders (as buyer)</p>
                    <p className="text-3xl font-black text-white flex items-center gap-2">
                        <ShoppingCart className="h-6 w-6 text-green-400" />
                        {user._count.orders}
                    </p>
                </div>
                <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                    <p className="text-muted-foreground text-sm mb-2">Affiliate Links</p>
                    <p className="text-3xl font-black text-white flex items-center gap-2">
                        <TrendingUp className="h-6 w-6 text-orange-400" />
                        {user._count.affiliateLinks}
                    </p>
                </div>
                <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                    <p className="text-muted-foreground text-sm mb-2">Joined</p>
                    <p className="text-sm font-bold text-white">
                        {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* User Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Info */}
                <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground/50" />
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Email</p>
                                <p className="text-sm text-white">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-muted-foreground/50" />
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Username</p>
                                <p className="text-sm text-white">@{user.username}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Info */}
                <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-4">Account Information</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-muted-foreground mb-2">Plan</p>
                            <p className="text-sm text-white font-bold">{user.plan}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-2">Member Since</p>
                            <p className="text-sm text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                        {user.customDomain && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-2">Custom Domain</p>
                                <p className="text-sm text-white flex items-center gap-2">
                                    {user.customDomain}
                                    {user.domainVerified ? (
                                        <span className="text-green-400 text-xs font-bold">✓ Verified</span>
                                    ) : (
                                        <span className="text-yellow-400 text-xs font-bold">⏳ Pending</span>
                                    )}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Details */}
            <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white mb-4">Profile</h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-xs text-muted-foreground mb-2">Bio</p>
                        <p className="text-sm text-white/80">{user.bio || "—"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-2">Niche</p>
                        <p className="text-sm text-white/80">{user.niche || "—"}</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="rounded-xl border border-border/50 bg-surface-raised/50 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white mb-4">Admin Actions</h3>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-border/50">
                        View Products
                    </Button>
                    <Button variant="outline" className="border-border/50">
                        View Orders
                    </Button>
                    <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                        Disable Account
                    </Button>
                </div>
            </div>
        </div>
    );
}
