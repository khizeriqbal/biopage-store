"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    ShoppingBag,
    Calendar,
    Mail,
    BarChart3,
    Palette,
    Settings,
    ExternalLink,
    ChevronRight,
    Tag,
    Package,
    Users,
    MessageSquare,
    Zap,
    Globe,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/AuthProvider";

const navItems = [
    { label: "Overview", icon: Home, href: "/dashboard" },
    { label: "Products", icon: ShoppingBag, href: "/dashboard/products" },
    { label: "Bundles", icon: Package, href: "/dashboard/bundles" },
    { label: "Bookings", icon: Calendar, href: "/dashboard/bookings" },
    { label: "Coupons", icon: Tag, href: "/dashboard/coupons" },
    { label: "Affiliates", icon: Users, href: "/dashboard/affiliates" },
    { label: "Reviews", icon: MessageSquare, href: "/dashboard/reviews" },
    { label: "Email List", icon: Mail, href: "/dashboard/subscribers" },
    { label: "Sequences", icon: Zap, href: "/dashboard/email-sequences" },
    { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
    { label: "Page Builder", icon: Palette, href: "/dashboard/customize" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        window.location.href = "/login";
    };

    const userEmail = user?.email || "";
    const userName = user?.user_metadata?.full_name || userEmail.split("@")[0] || "User";
    const userInitial = userName?.charAt(0) ?? "U";

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-60 border-r border-border bg-dark-bg/50 backdrop-blur-md hidden md:flex flex-col">
            <div className="p-6">
                <Logo />
            </div>

            <nav className="flex-1 space-y-0.5 px-3 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-muted/50",
                                isActive ? "bg-brand text-white hover:bg-brand/90" : "text-muted-foreground hover:text-white"
                            )}
                        >
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto border-t border-border p-4 space-y-3">
                {user && (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-border">
                                <AvatarFallback>{userInitial}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                                <span className="truncate text-sm font-semibold">{userName}</span>
                                <Badge variant="secondary" className="w-fit text-[10px] h-4 uppercase tracking-wider bg-accent/20 text-accent border-none leading-none">
                                    FREE
                                </Badge>
                            </div>
                        </div>

                        <Link
                            href={`/me`}
                            target="_blank"
                            className="flex items-center justify-between gap-1 rounded-lg border border-border bg-surface-raised/50 px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-surface-hover hover:text-white group"
                        >
                            <span className="flex items-center gap-2">
                                <Globe className="h-3 w-3" />
                                <span>View my page</span>
                                <ExternalLink className="h-3 w-3" />
                            </span>
                            <ChevronRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                        </Link>

                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 rounded-lg border border-border bg-surface-raised/50 px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                        >
                            <LogOut className="h-4 w-4 shrink-0" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}
