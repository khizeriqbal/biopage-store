"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, Plus, Trash2, ToggleLeft, ToggleRight, PlusCircle, X } from "lucide-react";

interface EmailStep {
    subject: string;
    body: string;
    delayDays: string;
}

interface EmailSequence {
    id: string;
    name: string;
    trigger: "SUBSCRIBER_JOIN" | "POST_PURCHASE";
    active: boolean;
    createdAt: string;
    steps: EmailStep[];
    _count: { enrollments: number };
}

export default function EmailSequencesPage() {
    const [sequences, setSequences] = useState<EmailSequence[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        trigger: "SUBSCRIBER_JOIN",
        steps: [{ subject: "", body: "", delayDays: "0" }] as EmailStep[],
    });

    const fetchSequences = async () => {
        const res = await fetch("/api/email-sequences");
        const data = await res.json();
        setSequences(Array.isArray(data) ? data : []);
    };

    useEffect(() => { fetchSequences(); }, []);

    const addStep = () => {
        setForm(f => ({ ...f, steps: [...f.steps, { subject: "", body: "", delayDays: "1" }] }));
    };

    const removeStep = (i: number) => {
        setForm(f => ({ ...f, steps: f.steps.filter((_, idx) => idx !== i) }));
    };

    const updateStep = (i: number, field: keyof EmailStep, value: string) => {
        setForm(f => ({
            ...f,
            steps: f.steps.map((s, idx) => idx === i ? { ...s, [field]: value } : s)
        }));
    };

    const handleCreate = async () => {
        if (!form.name || form.steps.some(s => !s.subject || !s.body)) {
            toast.error("Name and all step subjects/bodies are required");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/email-sequences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Email sequence created!");
                setOpen(false);
                setForm({ name: "", trigger: "SUBSCRIBER_JOIN", steps: [{ subject: "", body: "", delayDays: "0" }] });
                fetchSequences();
            } else {
                const d = await res.json();
                toast.error(d.error || "Failed to create sequence");
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (id: string, active: boolean) => {
        await fetch("/api/email-sequences", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, active: !active }),
        });
        toast.success(active ? "Sequence paused" : "Sequence activated!");
        fetchSequences();
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/email-sequences?id=${id}`, { method: "DELETE" });
        toast.success("Sequence deleted");
        fetchSequences();
    };

    return (
        <div className="space-y-8 pb-24 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        Email Sequences <Mail className="h-6 w-6 text-muted-foreground" />
                    </h1>
                    <p className="text-muted-foreground mt-1">Automated email series triggered by subscriber joins or purchases.</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-brand text-white hover:bg-brand/90 font-bold gap-2">
                            <Plus className="h-4 w-4" /> New Sequence
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-dark-bg border-border max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-white">Create Email Sequence</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-5 pt-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sequence Name</Label>
                                    <Input
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        placeholder="Welcome Series"
                                        className="bg-surface-raised border-border text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Trigger</Label>
                                    <Select value={form.trigger} onValueChange={v => setForm(f => ({ ...f, trigger: v }))}>
                                        <SelectTrigger className="bg-surface-raised border-border text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SUBSCRIBER_JOIN">Subscriber Joins</SelectItem>
                                            <SelectItem value="POST_PURCHASE">After Purchase</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Steps</Label>
                                    <Button variant="ghost" size="sm" onClick={addStep} className="text-brand hover:bg-brand/10 text-xs gap-1">
                                        <PlusCircle className="h-3.5 w-3.5" /> Add Step
                                    </Button>
                                </div>
                                {form.steps.map((step, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-border bg-surface-raised/40 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                                                Step {i + 1} — Day {step.delayDays}
                                            </span>
                                            {form.steps.length > 1 && (
                                                <Button variant="ghost" size="icon" onClick={() => removeStep(i)} className="h-6 w-6 text-muted-foreground hover:text-red-400">
                                                    <X className="h-3.5 w-3.5" />
                                                </Button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="col-span-2 space-y-1">
                                                <Label className="text-[10px] text-muted-foreground">Subject</Label>
                                                <Input
                                                    value={step.subject}
                                                    onChange={e => updateStep(i, "subject", e.target.value)}
                                                    placeholder="Welcome to the community!"
                                                    className="bg-surface border-border text-white h-9 text-sm"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] text-muted-foreground">Send after (days)</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={step.delayDays}
                                                    onChange={e => updateStep(i, "delayDays", e.target.value)}
                                                    className="bg-surface border-border text-white h-9 text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] text-muted-foreground">Email Body (HTML or plain text)</Label>
                                            <textarea
                                                value={step.body}
                                                onChange={e => updateStep(i, "body", e.target.value)}
                                                placeholder="Hi {name}, welcome to our community! Here's what to expect..."
                                                rows={4}
                                                className="w-full bg-surface border border-border text-white text-sm rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-brand"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button onClick={handleCreate} disabled={loading} className="w-full bg-brand text-white hover:bg-brand/90 font-bold">
                                {loading ? "Creating..." : `Create Sequence (${form.steps.length} steps)`}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {sequences.length === 0 ? (
                <div className="text-center py-24 rounded-3xl border border-dashed border-border">
                    <Mail className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground font-medium">No sequences yet</p>
                    <p className="text-sm text-muted-foreground/60 mt-1">Create automated email series to nurture your audience</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {sequences.map((seq) => (
                        <div key={seq.id} className={`p-5 rounded-2xl border bg-surface-raised/40 space-y-3 ${seq.active ? "border-brand/20" : "border-border"}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${seq.active ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground"}`}>
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-white">{seq.name}</span>
                                            <Badge className={`text-[10px] border-none ${seq.active ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                                                {seq.active ? "Active" : "Paused"}
                                            </Badge>
                                            <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">
                                                {seq.trigger === "SUBSCRIBER_JOIN" ? "On subscribe" : "Post-purchase"}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {seq.steps.length} steps • {seq._count.enrollments} enrolled
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleActive(seq.id, seq.active)}
                                        className="text-muted-foreground hover:text-white text-xs gap-1"
                                    >
                                        {seq.active ? <ToggleRight className="h-4 w-4 text-green-400" /> : <ToggleLeft className="h-4 w-4" />}
                                        {seq.active ? "Pause" : "Activate"}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(seq.id)}
                                        className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10 h-8 w-8"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
