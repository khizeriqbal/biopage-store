"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    Users2,
    Mail,
    Settings,
    LogOut,
    TrendingUp,
    Crown,
} from "lucide-react";
import { signOut } from "next-auth/react";

const ADMIN_MENU = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Orders & Revenue", href: "/admin/orders", icon: ShoppingCart },
    { label: "Affiliates", href: "/admin/affiliates", icon: TrendingUp },
    { label: "JV Partners", href: "/admin/jv-partners", icon: Crown },
    { label: "Email Sequences", href: "/admin/email-sequences", icon: Mail },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 min-h-screen bg-surface-raised border-r border-border/50 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-border/50">
                <Link href="/admin" className="text-xl font-black text-brand">
                    🔐 Admin Panel
                </Link>
                <p className="text-xs text-muted-foreground mt-1">Manage bio page.store</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {ADMIN_MENU.map(({ label, href, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                            pathname === href
                                ? "bg-brand text-white"
                                : "text-muted-foreground hover:text-white hover:bg-surface-raised"
                        )}
                    >
                        <Icon className="h-4 w-4 shrink-0" />
                        {label}
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border/50 space-y-2">
                <button
                    onClick={() => signOut({ redirectTo: "/" })}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-white hover:bg-surface-raised transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
