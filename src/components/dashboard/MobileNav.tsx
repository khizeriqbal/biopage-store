"use client";

import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Sidebar } from "./Sidebar";
import { useState } from "react";

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex h-16 items-center justify-between border-b border-border bg-dark-bg/50 px-4 backdrop-blur-md md:hidden sticky top-0 z-50">
            <Logo />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger render={
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-surface-hover hover:text-white">
                        <Menu className="h-6 w-6" />
                    </Button>
                } />
                <SheetContent side="left" className="w-[280px] border-r border-border bg-dark-bg p-0">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Navigation Menu</SheetTitle>
                        <SheetDescription>Main navigation for the creator dashboard</SheetDescription>
                    </SheetHeader>
                    <div onClick={() => setIsOpen(false)} className="h-full">
                        <Sidebar />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
