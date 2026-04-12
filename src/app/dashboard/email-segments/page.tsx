"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Plus, Edit2, Mail, BarChart3, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailSegment {
  id: string;
  name: string;
  description: string;
  subscribers: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

export default function EmailSegmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [segments, setSegments] = useState<EmailSegment[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      setSegments([
        {
          id: "1",
          name: "High-Value Customers",
          description: "Customers who spent over $100",
          subscribers: 1247,
          openRate: 48.2,
          clickRate: 12.5,
          conversionRate: 3.8,
        },
        {
          id: "2",
          name: "New Subscribers",
          description: "Joined in the last 30 days",
          subscribers: 456,
          openRate: 52.1,
          clickRate: 15.2,
          conversionRate: 2.5,
        },
        {
          id: "3",
          name: "Inactive Users",
          description: "Haven't opened email in 60 days",
          subscribers: 892,
          openRate: 18.5,
          clickRate: 2.1,
          conversionRate: 0.5,
        },
        {
          id: "4",
          name: "Course Buyers",
          description: "Purchased online courses",
          subscribers: 623,
          openRate: 42.3,
          clickRate: 8.9,
          conversionRate: 1.2,
        },
      ]);
    }
  }, [user]);


  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  const totalSubscribers = segments.reduce((sum, s) => sum + s.subscribers, 0);
  const avgOpenRate = (segments.reduce((sum, s) => sum + s.openRate, 0) / segments.length).toFixed(1);

  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold text-white">Email Segmentation</h1><p className="text-muted-foreground mt-2">Create targeted segments for higher engagement</p></div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="card-modern"><p className="text-muted-foreground text-sm mb-2">Total Segments</p><p className="text-3xl font-bold text-white">{segments.length}</p><p className="text-xs text-blue-400 mt-2">Active segments</p></div>
        <div className="card-modern"><p className="text-muted-foreground text-sm mb-2">Total Subscribers</p><p className="text-3xl font-bold text-emerald-400">{totalSubscribers.toLocaleString()}</p><p className="text-xs text-emerald-400 mt-2">Across all segments</p></div>
        <div className="card-modern"><p className="text-muted-foreground text-sm mb-2">Avg Open Rate</p><p className="text-3xl font-bold text-yellow-400">{avgOpenRate}%</p><p className="text-xs text-yellow-400 mt-2">Performance metric</p></div>
        <div className="card-modern"><p className="text-muted-foreground text-sm mb-2">Avg Click Rate</p><p className="text-3xl font-bold text-purple-400">9.7%</p><p className="text-xs text-purple-400 mt-2">Performance metric</p></div>
      </div>

      <button className="w-full card-modern border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10"><div className="flex items-center justify-center gap-3 py-6"><Plus className="w-4 h-4" /><span className="font-semibold text-emerald-400 text-lg">Create New Segment</span></div></button>

      <div className="card-modern overflow-x-auto">
        <h3 className="font-bold text-white text-lg mb-4">Email Segments</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-slate-800/50">
              <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Segment</th>
              <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Subscribers</th>
              <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Open Rate</th>
              <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Click Rate</th>
              <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Conversion</th>
              <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {segments.map((seg) => (
              <tr key={seg.id} className="hover:bg-white/5">
                <td className="py-4 px-4"><div><p className="font-semibold text-white">{seg.name}</p><p className="text-xs text-muted-foreground">{seg.description}</p></div></td>
                <td className="py-4 px-4"><Users className="h-4 w-4 text-blue-400 inline mr-2" /><span className="font-semibold text-white">{seg.subscribers.toLocaleString()}</span></td>
                <td className="py-4 px-4 text-emerald-400 font-semibold">{seg.openRate}%</td>
                <td className="py-4 px-4 text-yellow-400 font-semibold">{seg.clickRate}%</td>
                <td className="py-4 px-4 text-purple-400 font-semibold">{seg.conversionRate}%</td>
                <td className="py-4 px-4"><div className="flex gap-2"><button className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"><Mail className="h-4 w-4" /></button><button className="p-1.5 rounded-lg bg-slate-700/20 text-white hover:bg-slate-700/40"><Edit2 className="h-4 w-4" /></button><button className="p-1.5 rounded-lg bg-slate-700/20 text-white hover:bg-slate-700/40"><BarChart3 className="h-4 w-4" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card-modern"><h3 className="font-bold text-white text-lg mb-4">A/B Testing Experiments</h3><div className="space-y-3"><div className="p-4 rounded-lg bg-slate-700/20 border border-white/10"><div className="flex justify-between mb-2"><h4 className="font-semibold text-white">Subject Line Test</h4><span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Active</span></div><p className="text-sm text-muted-foreground mb-3">Emoji vs No Emoji testing</p><div className="grid grid-cols-2 gap-4"><div><p className="text-xs text-muted-foreground">Variant A: With Emoji</p><p className="text-sm font-semibold text-white">38.2% open rate</p></div><div><p className="text-xs text-muted-foreground">Variant B: No Emoji</p><p className="text-sm font-semibold text-white">42.5% open rate</p></div></div></div></div><button className="w-full mt-4 card-modern border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10"><div className="flex justify-center gap-2"><TrendingUp className="h-4 w-4 text-blue-400" /><span className="text-blue-400 font-semibold">Create A/B Test</span></div></button></div>
    </div>
  );
}
