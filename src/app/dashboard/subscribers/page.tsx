"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Mail, Trash2, MailPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Subscriber {
  id: string;
  email: string;
  name: string;
  subscribedAt: string;
  status: "active" | "unsubscribed";
}

export default function SubscribersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({ name: "", email: "" });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      setSubscribers([
        {
          id: "1",
          email: "john@example.com",
          name: "John Doe",
          subscribedAt: "2026-04-01",
          status: "active",
        },
        {
          id: "2",
          email: "jane@example.com",
          name: "Jane Smith",
          subscribedAt: "2026-04-02",
          status: "active",
        },
        {
          id: "3",
          email: "bob@example.com",
          name: "Bob Johnson",
          subscribedAt: "2026-04-03",
          status: "unsubscribed",
        },
      ]);
    }
  }, [user]);

  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    const newSub: Subscriber = {
      id: Date.now().toString(),
      email: newSubscriber.email,
      name: newSubscriber.name,
      subscribedAt: new Date().toISOString().split("T")[0],
      status: "active",
    };
    setSubscribers([...subscribers, newSub]);
    setNewSubscriber({ name: "", email: "" });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Remove this subscriber?")) {
      setSubscribers(subscribers.filter((s) => s.id !== id));
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  const activeCount = subscribers.filter((s) => s.status === "active").length;
  const unsubscribeRate = activeCount > 0 ? (((subscribers.length - activeCount) / subscribers.length) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Email Subscribers</h1>
          <p className="text-muted-foreground mt-2">Manage your email list</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-brand hover:bg-brand/90"
        >
          <MailPlus className="w-4 h-4 mr-2" />
          Add Subscriber
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-muted-foreground text-sm mb-2">Total Subscribers</p>
          <p className="text-3xl font-bold text-white">{subscribers.length}</p>
        </div>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-muted-foreground text-sm mb-2">Active</p>
          <p className="text-3xl font-bold text-green-400">{activeCount}</p>
        </div>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-muted-foreground text-sm mb-2">Unsubscribe Rate</p>
          <p className="text-3xl font-bold text-white">{unsubscribeRate}%</p>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <form onSubmit={handleAddSubscriber} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={newSubscriber.name}
              onChange={(e) => setNewSubscriber({ ...newSubscriber, name: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newSubscriber.email}
              onChange={(e) => setNewSubscriber({ ...newSubscriber, email: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand"
              required
            />
            <div className="flex gap-4">
              <Button type="submit" className="flex-1 bg-brand hover:bg-brand/90">
                Add Subscriber
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

      {/* Subscribers Table */}
      <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-white">Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-white">Email</th>
                <th className="px-6 py-4 text-sm font-semibold text-white">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-white">Subscribed</th>
                <th className="px-6 py-4 text-sm font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-white/10 hover:bg-white/5 transition">
                  <td className="px-6 py-4 text-white font-medium">{sub.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{sub.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        sub.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {sub.status === "active" ? "Active" : "Unsubscribed"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-sm">{sub.subscribedAt}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
