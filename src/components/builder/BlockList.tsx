"use client";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    GripVertical,
    Eye,
    EyeOff,
    Settings2,
    ShoppingBag,
    Calendar,
    Mail,
    User,
    ExternalLink,
    Video,
    MessageSquare,
    Youtube,
    Clock,
    HelpCircle,
    Quote
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export interface Block {
    id: string;
    type: string;
    enabled: boolean;
    title?: string;
    // YouTube block
    url?: string;
    // Countdown block
    date?: string;
    // FAQ block
    items?: { question: string; answer: string }[];
    // Testimonial block
    quote?: string;
    author?: string;
}

const blockIcons: Record<string, any> = {
    PRODUCTS: ShoppingBag,
    BOOKING: Calendar,
    EMAIL: Mail,
    ABOUT: User,
    SOCIAL: ExternalLink,
    VIDEO: Video,
    TESTIMONIALS: MessageSquare,
    YOUTUBE: Youtube,
    COUNTDOWN: Clock,
    FAQ: HelpCircle,
    TESTIMONIAL: Quote,
};

const blockLabels: Record<string, string> = {
    PRODUCTS: "Products",
    BOOKING: "Bookings",
    EMAIL: "Email Capture",
    ABOUT: "About Me",
    SOCIAL: "Social Links",
    VIDEO: "Video",
    TESTIMONIALS: "Testimonials",
    YOUTUBE: "YouTube Video",
    COUNTDOWN: "Countdown Timer",
    FAQ: "FAQ Section",
    TESTIMONIAL: "Testimonial Quote",
};

function SortableBlock({
    block,
    onToggle,
    onSettings
}: {
    block: Block,
    onToggle: (id: string) => void,
    onSettings: (id: string) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
    };

    const Icon = blockIcons[block.type] || ExternalLink;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center gap-3 p-3 rounded-xl border border-border bg-surface-raised transition-all",
                isDragging && "opacity-50 ring-2 ring-brand border-brand shadow-xl",
                !block.enabled && "opacity-60 bg-surface grayscale"
            )}
        >
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab hover:text-white text-muted-foreground"
            >
                <GripVertical className="h-4 w-4" />
            </button>

            <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center",
                block.enabled ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground"
            )}>
                <Icon className="h-4 w-4" />
            </div>

            <span className="flex-1 text-sm font-semibold text-white truncate">
                {block.title || blockLabels[block.type] || block.type}
            </span>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:bg-surface-hover hover:text-white"
                    onClick={() => onSettings(block.id)}
                >
                    <Settings2 className="h-4 w-4" />
                </Button>
                <Switch
                    checked={block.enabled}
                    onCheckedChange={() => onToggle(block.id)}
                    className="data-[state=checked]:bg-brand"
                />
            </div>
        </div>
    );
}

export const DEFAULT_BLOCK_TYPES = [
    "PRODUCTS", "EMAIL", "ABOUT", "YOUTUBE", "COUNTDOWN", "FAQ", "TESTIMONIAL"
];

export function BlockList({
    blocks,
    onReorder,
    onToggle,
    onSettings
}: {
    blocks: Block[],
    onReorder: (blocks: Block[]) => void,
    onToggle: (id: string) => void,
    onSettings: (id: string) => void
}) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = blocks.findIndex((b) => b.id === active.id);
            const newIndex = blocks.findIndex((b) => b.id === over.id);
            onReorder(arrayMove(blocks, oldIndex, newIndex));
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-3">
                    {blocks.map((block) => (
                        <SortableBlock
                            key={block.id}
                            block={block}
                            onToggle={onToggle}
                            onSettings={onSettings}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
