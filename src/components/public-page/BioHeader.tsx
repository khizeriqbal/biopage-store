"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Share2, Instagram, Twitter, Linkedin, Github, Youtube } from "lucide-react";
import { toast } from "sonner";

interface BioHeaderProps {
    user: {
        name: string | null;
        bio: string | null;
        avatar: string | null;
        username: string;
    };
    settings: {
        primaryColor: string;
        accentColor: string;
        socialLinks: any;
    };
}

const socialIcons: Record<string, any> = {
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    github: Github,
    youtube: Youtube,
};

export function BioHeader({ user, settings }: BioHeaderProps) {
    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="w-full">
            {/* Banner/Header background */}
            <div
                className="h-48 w-full relative"
                style={{
                    background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})`,
                    opacity: 0.9
                }}
            >
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 group">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-2xl transition-transform duration-500 group-hover:scale-105">
                        <AvatarImage src={user.avatar ?? ""} alt={user.name ?? ""} />
                        <AvatarFallback className="text-3xl font-bold bg-surface">
                            {user.name?.charAt(0) ?? user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>

            <div className="mt-20 px-6 text-center space-y-6 max-w-2xl mx-auto">
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        {user.name ?? `@${user.username}`}
                    </h1>
                    {user.bio && (
                        <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                            {user.bio}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    {Object.entries(settings.socialLinks).map(([platform, url]) => {
                        const Icon = socialIcons[platform.toLowerCase()] ?? Share2;
                        if (!url) return null;
                        return (
                            <Button
                                key={platform}
                                variant="outline"
                                size="icon"
                                className="rounded-full border-border bg-surface-raised/50 hover:bg-surface-hover hover:border-brand/50 transition-all h-10 w-10"
                                asChild
                            >
                                <a href={url as string} target="_blank" rel="noopener noreferrer">
                                    <Icon className="h-5 w-5" />
                                </a>
                            </Button>
                        );
                    })}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleShare}
                        className="rounded-full border-border bg-surface-raised/50 hover:bg-surface-hover hover:border-brand/50 transition-all h-10 w-10"
                    >
                        <Share2 className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
