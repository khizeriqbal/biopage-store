"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Copy, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Affiliate {
  id: string;
  name: string;
  email: string;
  link: string;
  clicks: number;
  conversions: number;
  commission: number;
  status: "active" | "paused";
}

export default function AffiliatesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [copied, setCopied] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newAffiliate, setNewAffiliate] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      setAffiliates([
        {
          id: "1",
          name: "John Smith",
          email: "john@example.com",
          link: "https://biopage.store?aff=john123",
          clicks: 284,
          conversions: 6,
          commission: 102,
          status: "active",
        },
        {
          id: "2",
          name: "Sarah Jones",
          email: "sarah@example.com",
          link: "https://biopage.store?aff=sarah456",
          clicks: 156,
          conversions: 3,
          commission: 51,
          status: "active",
        },
      ]);
    }
  }, [user]);

  const generateAffiliateLink = () => {
    const code = Math.random().toString(36).substr(2, 9);
    const newAff: Affiliate = {
      id: Date.now().toString(),
      name: newAffiliate.name,
      email: newAffiliate.email,
      link: `https://biopage.store?aff=${code}`,
      clicks: 0,
      conversions: 0,
      commission: 0,
      status: "active",
    };
    setAffiliates([...affiliates, newAff]);
    setNewAffiliate({ name: "", email: "" });
    setShowForm(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  const totalCommission = affiliates.reduce((sum, a) => sum + a.commission, 0);
  const totalClicks = affiliates.reduce((sum, a) => sum + a.clicks, 0);
  const totalConversions = affiliates.reduce((sum, a) => sum + a.conversions, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Affiliate Program</h1>
          <p className="text-muted-foreground mt-2">Manage your affiliate partners</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-brand hover:bg-brand/90"
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          Add Affiliate
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-muted-foreground text-sm mb-2">Total Affiliates</p>
          <p className="text-3xl font-bold text-white">{affiliates.length}</p>
        </div>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-muted-foreground text-sm mb-2">Total Clicks</p>
          <p className="text-3xl font-bold text-white">{totalClicks}</p>
        </div>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-muted-foreground text-sm mb-2">Total Conversions</p>
          <p className="text-3xl font-bold text-green-400">{totalConversions}</p>
        </div>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-muted-foreground text-sm mb-2">Total Commission Owed</p>
          <p className="text-3xl font-bold text-brand">${totalCommission}</p>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <form onSubmit={(e) => { e.preventDefault(); generateAffiliateLink(); }} className="space-y-4">
            <input
              type="text"
              placeholder="Affiliate Name"
              value={newAffiliate.name}
              onChange={(e) => setNewAffiliate({ ...newAffiliate, name: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={newAffiliate.email}
              onChange={(e) => setNewAffiliate({ ...newAffiliate, email: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand"
              required
            />
            <div className="flex gap-4">
              <Button type="submit" className="flex-1 bg-brand hover:bg-brand/90">
                Generate Link
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-white/20 hover:bg-white/5"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Affiliates Table */}
      <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-white">Affiliate</th>
                <th className="px-6 py-4 text-sm font-semibold text-white">Affiliate Link</th>
                <th className="px-6 py-4 text-sm font-semibold text-white">Clicks</th>
                <th className="px-6 py-4 text-sm font-semibold text-white">Conversions</th>
                <th className="px-6 py-4 text-sm font-semibold text-white">Commission</th>
                <th className="px-6 py-4 text-sm font-semibold text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((aff) => (
                <tr key={aff.id} className="border-b border-white/10 hover:bg-white/5 transition">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">{aff.name}</p>
                      <p className="text-xs text-muted-foreground">{aff.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground truncate max-w-xs">{aff.link}</p>
                      <button
                        onClick={() => copyToClipboard(aff.link, aff.id)}
                        className="p-1 text-brand hover:bg-brand/10 rounded transition"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    {copied === aff.id && <p className="text-xs text-green-400 mt-1">Copied!</p>}
                  </td>
                  <td className="px-6 py-4 text-white">{aff.clicks}</td>
                  <td className="px-6 py-4 text-white">{aff.conversions}</td>
                  <td className="px-6 py-4 text-brand font-semibold">${aff.commission}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
