"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import Link from "next/link";
import { LogOut, Settings, Plus, BarChart3, Users, Package } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full" />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {session.user.name || session.user.email}!
          </h1>
          <p className="text-muted-foreground">
            Manage your products, subscribers, and store settings from here.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-white">$0.00</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-brand/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-brand" />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Products</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Subscribers</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Store Views</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/products/new"
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-brand hover:bg-white/10 transition group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center group-hover:bg-brand/30 transition">
                  <Plus className="w-5 h-5 text-brand" />
                </div>
                <h3 className="font-semibold text-white">Add Product</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Create a new digital product to sell
              </p>
            </Link>

            <Link
              href="/onboarding"
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-brand hover:bg-white/10 transition group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition">
                  <Settings className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white">Store Settings</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Customize your store appearance and settings
              </p>
            </Link>

            <Link
              href="/dashboard/analytics"
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-brand hover:bg-white/10 transition group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white">View Analytics</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                See your sales, views, and subscriber growth
              </p>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No recent activity yet</p>
            <p className="text-sm text-muted-foreground/60 mt-2">
              Start by adding your first product or customizing your store
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
