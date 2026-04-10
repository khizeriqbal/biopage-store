"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DollarSign, ShoppingCart, Eye, TrendingUp, Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [timeframe, setTimeframe] = useState("month");

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  // Sample analytics data
  const kpis = [
    { label: "Total Revenue", value: "$2,170", change: "+12%", icon: DollarSign },
    { label: "Total Sales", value: "70", change: "+5%", icon: ShoppingCart },
    { label: "Store Views", value: "3,420", change: "+28%", icon: Eye },
    { label: "Conversion Rate", value: "2.0%", change: "+0.3%", icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-muted-foreground mt-2">Your store performance overview</p>
        </div>
        <div className="flex gap-2">
          {["week", "month", "all"].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                timeframe === t
                  ? "bg-brand text-white"
                  : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpis.map(({ label, value, change, icon: Icon }) => (
          <div key={label} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-brand/50 transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
              <div className="p-2 rounded-lg bg-brand/10">
                <Icon className="w-5 h-5 text-brand" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{value}</p>
            <p className={`text-sm font-medium ${change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
              {change} vs last month
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-lg font-bold text-white mb-6">Revenue (Last 30 Days)</h2>
          <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-brand/50 mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground">Chart visualization coming soon</p>
            </div>
          </div>
        </div>

        {/* Sales by Product */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-lg font-bold text-white mb-6">Sales by Product</h2>
          <div className="space-y-4">
            {[
              { name: "Email Template Bundle", sales: 42, percent: 60 },
              { name: "Notion Dashboard", sales: 28, percent: 40 },
            ].map((product) => (
              <div key={product.name}>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-white">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand to-brand/50"
                    style={{ width: `${product.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h2 className="text-lg font-bold text-white mb-6">Top Performing Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-white">Product</th>
                <th className="px-6 py-3 text-sm font-semibold text-white">Sales</th>
                <th className="px-6 py-3 text-sm font-semibold text-white">Revenue</th>
                <th className="px-6 py-3 text-sm font-semibold text-white">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Email Template Bundle", sales: 42, revenue: 1134, conversion: "2.1%" },
                { name: "Notion Dashboard Template", sales: 28, revenue: 1036, conversion: "1.8%" },
              ].map((product) => (
                <tr key={product.name} className="border-b border-white/10 hover:bg-white/5 transition">
                  <td className="px-6 py-4 text-white font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-white">{product.sales}</td>
                  <td className="px-6 py-4 text-brand font-semibold">${product.revenue}</td>
                  <td className="px-6 py-4 text-green-400">{product.conversion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Advanced Analytics (Coming Soon)</h3>
        <ul className="space-y-2 text-muted-foreground">
          <li>✓ Traffic sources and visitor flow</li>
          <li>✓ Email subscriber trends</li>
          <li>✓ Customer cohort analysis</li>
          <li>✓ Revenue forecasting</li>
          <li>✓ Custom date range analytics</li>
        </ul>
      </div>
    </div>
  );
}
