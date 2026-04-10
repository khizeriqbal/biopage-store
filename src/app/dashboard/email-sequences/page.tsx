"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Plus, Edit2, Trash2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailSequence {
  id: string;
  name: string;
  description: string;
  emailCount: number;
  subscribers: number;
  status: "active" | "paused" | "draft";
  createdAt: string;
}

export default function EmailSequencesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newSequence, setNewSequence] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      setSequences([
        {
          id: "1",
          name: "Welcome Series",
          description: "3-email welcome sequence for new subscribers",
          emailCount: 3,
          subscribers: 156,
          status: "active",
          createdAt: "2026-04-01",
        },
        {
          id: "2",
          name: "Product Launch",
          description: "5-email launch sequence for new product",
          emailCount: 5,
          subscribers: 89,
          status: "active",
          createdAt: "2026-04-05",
        },
        {
          id: "3",
          name: "Upsell Campaign",
          description: "2-email sequence to upsell customers",
          emailCount: 2,
          subscribers: 42,
          status: "draft",
          createdAt: "2026-04-08",
        },
      ]);
    }
  }, [user]);

  const handleCreateSequence = (e: React.FormEvent) => {
    e.preventDefault();
    const newSeq: EmailSequence = {
      id: Date.now().toString(),
      name: newSequence.name,
      description: newSequence.description,
      emailCount: 1,
      subscribers: 0,
      status: "draft",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setSequences([...sequences, newSeq]);
    setNewSequence({ name: "", description: "" });
    setShowForm(false);
  };

  const handleToggleStatus = (id: string) => {
    setSequences(
      sequences.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "paused" : "active" }
          : s
      )
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this email sequence?")) {
      setSequences(sequences.filter((s) => s.id !== id));
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  const activeSequences = sequences.filter((s) => s.status === "active").length;
  const totalEmails = sequences.reduce((sum, s) => sum + s.emailCount, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Email Sequences</h1>
          <p className="text-muted-foreground mt-2">Automate your email marketing campaigns</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-brand hover:bg-brand/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Sequence
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-muted-foreground text-sm mb-2">Total Sequences</p>
          <p className="text-3xl font-bold text-white">{sequences.length}</p>
        </div>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-muted-foreground text-sm mb-2">Active Sequences</p>
          <p className="text-3xl font-bold text-green-400">{activeSequences}</p>
        </div>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-muted-foreground text-sm mb-2">Total Emails</p>
          <p className="text-3xl font-bold text-white">{totalEmails}</p>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">Create New Email Sequence</h2>
          <form onSubmit={handleCreateSequence} className="space-y-4">
            <input
              type="text"
              placeholder="Sequence Name (e.g., Welcome Series)"
              value={newSequence.name}
              onChange={(e) => setNewSequence({ ...newSequence, name: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand"
              required
            />
            <textarea
              placeholder="Description (e.g., 3-email welcome sequence for new subscribers)"
              value={newSequence.description}
              onChange={(e) => setNewSequence({ ...newSequence, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand"
            />
            <p className="text-sm text-muted-foreground">
              ℹ️ After creating, you'll be able to add individual emails to your sequence.
            </p>
            <div className="flex gap-4">
              <Button type="submit" className="flex-1 bg-brand hover:bg-brand/90">
                Create Sequence
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

      {/* Sequences List */}
      <div className="space-y-4">
        {sequences.map((seq) => (
          <div key={seq.id} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-brand/50 transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{seq.name}</h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      seq.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : seq.status === "paused"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {seq.status === "active" ? "Active" : seq.status === "paused" ? "Paused" : "Draft"}
                  </span>
                </div>
                <p className="text-muted-foreground mb-3">{seq.description}</p>
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Emails</p>
                    <p className="text-lg font-bold text-white">{seq.emailCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Subscribers</p>
                    <p className="text-lg font-bold text-white">{seq.subscribers}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-lg font-bold text-white">{seq.createdAt}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleStatus(seq.id)}
                  className="p-2 text-brand hover:bg-brand/10 rounded-lg transition"
                  title={seq.status === "active" ? "Pause" : "Activate"}
                >
                  {seq.status === "active" ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
                <button
                  className="p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-lg transition"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(seq.id)}
                  className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
