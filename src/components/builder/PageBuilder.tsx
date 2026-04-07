"use client";

import { useState, useCallback } from "react";
import {
    Plus,
    Trash2,
    Save,
    Settings,
    User,
    Image as ImageIcon,
    Palette,
    LayoutGrid,
    Zap,
    Globe,
    Upload,
    X,
    Sparkles,
    Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeSelector } from "./ThemeSelector";
import { BlockList } from "./BlockList";
import { LivePreview } from "./LivePreview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { AiButton } from "@/components/products/AiButton";
import { cn } from "@/lib/utils";

interface PageSettings {
    avatar?: string;
    name?: string;
    bio?: string;
    theme: string;
    primaryColor: string;
    accentColor: string;
    layout: any[];
    socialLinks: any;
    customCSS?: string;
}

export default function PageBuilder({ initialData }: { initialData?: PageSettings }) {
    const [settings, setSettings] = useState<PageSettings>(initialData || {
        theme: "midnight",
        primaryColor: "#5C4EFA",
        accentColor: "#C6FF4E",
        layout: [
            { id: "1", type: "ABOUT", enabled: true, title: "About Me" },
            { id: "2", type: "PRODUCTS", enabled: true, title: "My Products" },
            { id: "3", type: "EMAIL", enabled: true, title: "Join My List" },
        ],
        socialLinks: {},
    });
    const [isSaving, setIsSaving] = useState(false);

    const updateSettings = useCallback((updates: Partial<PageSettings>) => {
        setSettings(prev => ({ ...prev, ...updates }));
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/page-settings", {
                method: "PATCH",
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                toast.success("Page published live! ✨");
            } else {
                toast.error("Failed to save changes");
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-dark-bg animate-in fade-in duration-500">
            {/* Sidebar - Left Panel */}
            <div className="w-full md:w-[480px] h-full overflow-y-auto border-r border-border bg-dark-bg/50 backdrop-blur-md p-6 space-y-8 scrollbar-thin">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        Page Builder
                    </h2>
                    <p className="text-sm text-muted-foreground font-medium">Customize your link-in-bio storefront.</p>
                </div>

                {/* Section 1: Profile */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                            <User className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest leading-none">Profile Info</h3>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative group cursor-pointer">
                            <Avatar className="h-20 w-20 border-2 border-border group-hover:border-brand transition-all shadow-xl">
                                <AvatarImage src={settings.avatar} />
                                <AvatarFallback className="bg-surface text-2xl font-bold">{settings.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Display Name</Label>
                                <Input
                                    value={settings.name || ""}
                                    onChange={(e) => updateSettings({ name: e.target.value })}
                                    placeholder="e.g. Creator Name"
                                    className="bg-surface-raised border-border h-10 px-4 font-semibold text-white focus:ring-brand"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Short Bio</Label>
                            <AiButton
                                endpoint="/api/ai/bio"
                                payload={{ name: settings.name, niche: "creator" }}
                                onStream={(chunk) => {
                                    const current = settings.bio || "";
                                    if (chunk === "") updateSettings({ bio: "" });
                                    else updateSettings({ bio: current + chunk });
                                }}
                                variant="brand"
                                size="sm"
                                label="AI Bio"
                            />
                        </div>
                        <Textarea
                            value={settings.bio || ""}
                            onChange={(e) => updateSettings({ bio: e.target.value })}
                            placeholder="I help people..."
                            className="bg-surface-raised border-border min-h-[80px] resize-none leading-relaxed text-sm"
                        />
                    </div>
                </section>

                <Separator className="bg-border/50" />

                {/* Section 2: Theme */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                            <Palette className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest leading-none">Theme & Colors</h3>
                    </div>

                    <ThemeSelector
                        selected={settings.theme}
                        onSelect={(theme) => updateSettings({ theme })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Primary</Label>
                            <div className="flex items-center gap-3 bg-surface-raised p-2 rounded-xl border border-border">
                                <input
                                    type="color"
                                    value={settings.primaryColor}
                                    onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                                    className="h-8 w-8 rounded-lg bg-transparent border-0 cursor-pointer overflow-hidden p-0"
                                />
                                <span className="text-xs font-mono font-bold text-white uppercase">{settings.primaryColor}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Accent</Label>
                            <div className="flex items-center gap-3 bg-surface-raised p-2 rounded-xl border border-border">
                                <input
                                    type="color"
                                    value={settings.accentColor}
                                    onChange={(e) => updateSettings({ accentColor: e.target.value })}
                                    className="h-8 w-8 rounded-lg bg-transparent border-0 cursor-pointer overflow-hidden p-0"
                                />
                                <span className="text-xs font-mono font-bold text-white uppercase">{settings.accentColor}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <Separator className="bg-border/50" />

                {/* Section 3: Blocks */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <LayoutGrid className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest leading-none">Blocks</h3>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 text-brand font-bold text-[10px] tracking-widest uppercase hover:bg-brand/10 h-8 px-3">
                            <Plus className="h-3.5 w-3.5 mr-1" /> Add
                        </Button>
                    </div>

                    <BlockList
                        blocks={settings.layout}
                        onReorder={(layout) => updateSettings({ layout })}
                        onToggle={(id) => {
                            const newLayout = settings.layout.map(b => b.id === id ? { ...b, enabled: !b.enabled } : b);
                            updateSettings({ layout: newLayout });
                        }}
                        onSettings={(id) => toast.info(`Settings for block ${id} coming soon`)}
                    />
                </section>

                {/* Floating Save Button at bottom of panel */}
                <div className="sticky bottom-0 left-0 right-0 pt-8 pb-4 bg-gradient-to-t from-dark-bg to-transparent">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full bg-brand text-white hover:bg-brand/90 font-bold h-12 shadow-xl shadow-brand/20 rounded-xl"
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Globe className="h-4 w-4 mr-2" />}
                        Publish Page Live
                    </Button>
                </div>
            </div>

            {/* Preview - Right Panel */}
            <div className="hidden md:block flex-1 h-full">
                <LivePreview settings={settings} />
            </div>
        </div>
    );
}
