"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import {
    RadioGroup,
    RadioGroupItem
} from "@/components/ui/radio-group";
import {
    FileText,
    Video,
    Calendar,
    Users,
    Magnet,
    Check,
    Loader2,
    Sparkles,
    Upload,
    X
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { AiButton } from "./AiButton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import slugify from "slugify";

const productSchema = z.object({
    title: z.string().min(3, "Title too short"),
    type: z.enum(["DIGITAL", "COURSE", "BOOKING", "MEMBERSHIP", "LEAD_MAGNET"]),
    description: z.string().min(10, "Description too short"),
    price: z.coerce.number().min(0),
    comparePrice: z.coerce.number().optional(),
    coverImage: z.string().optional(),
    fileUrl: z.string().optional(),
    slug: z.string().min(3),
    published: z.boolean().default(false),
    featured: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

const productTypes = [
    { id: "DIGITAL", label: "Digital Download", icon: FileText, desc: "PDFs, templates, presets" },
    { id: "COURSE", label: "Online Course", icon: Video, desc: "Video lessons & resources" },
    { id: "BOOKING", label: "1:1 Coaching", icon: Calendar, desc: "Booking & calendar sessions" },
    { id: "MEMBERSHIP", label: "Membership", icon: Users, desc: "Recurring subscriptions" },
    { id: "LEAD_MAGNET", label: "Lead Magnet", icon: Magnet, desc: "Free for email signup" },
];

export function ProductForm({
    open,
    onClose,
    initialData
}: {
    open: boolean;
    onClose: () => void;
    initialData?: any
}) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("details");

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData || {
            title: "",
            type: "DIGITAL",
            description: "",
            price: 0,
            slug: "",
            published: true,
            featured: false,
        },
    });

    const onSubmit = async (values: ProductFormValues) => {
        setIsSubmitting(true);
        try {
            const endpoint = initialData ? `/api/products/${initialData.id}` : "/api/products";
            const method = initialData ? "PUT" : "POST";

            const res = await fetch(endpoint, {
                method,
                body: JSON.stringify(values),
            });

            if (res.ok) {
                toast.success(initialData ? "Product updated" : "Product created ✨");
                onClose();
                router.refresh();
            } else {
                const err = await res.json();
                toast.error(err.message || "Failed to save product");
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        form.setValue("title", title);
        if (!initialData) {
            form.setValue("slug", slugify(title, { lower: true, strict: true }));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl border-border bg-dark-bg p-0 gap-0 overflow-hidden shadow-2xl">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-2xl font-bold text-white">
                        {initialData ? "Edit Product" : "Create New Product"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {initialData ? "Make changes to your product here." : "Fill in the details to start selling your magic."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                            <div className="px-6 border-b border-border">
                                <TabsList className="bg-transparent h-auto p-0 gap-6 w-full justify-start">
                                    <TabsTrigger
                                        value="details"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand data-[state=active]:bg-transparent data-[state=active]:text-white pb-3 pt-0"
                                    >
                                        Details
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="media"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand data-[state=active]:bg-transparent data-[state=active]:text-white pb-3 pt-0"
                                    >
                                        Media
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="settings"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand data-[state=active]:bg-transparent data-[state=active]:text-white pb-3 pt-0"
                                    >
                                        Settings
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="p-6 max-h-[60vh] overflow-y-auto">
                                <TabsContent value="details" className="mt-0 space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product Title</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. My Awesome Preset Pack"
                                                        {...field}
                                                        onChange={handleTitleChange}
                                                        className="bg-surface-raised border-border"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>Product Type</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                                                    >
                                                        {productTypes.map((type) => (
                                                            <FormLabel
                                                                key={type.id}
                                                                className={cn(
                                                                    "flex flex-col items-center justify-between rounded-xl border border-border bg-surface-raised p-4 hover:bg-surface-hover/50 hover:border-brand/40 cursor-pointer transition-all",
                                                                    field.value === type.id && "border-brand bg-brand/5 ring-1 ring-brand/50"
                                                                )}
                                                            >
                                                                <RadioGroupItem value={type.id} className="sr-only" />
                                                                <div className={cn(
                                                                    "h-10 w-10 rounded-full flex items-center justify-center mb-3",
                                                                    field.value === type.id ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground"
                                                                )}>
                                                                    <type.icon className="h-5 w-5" />
                                                                </div>
                                                                <div className="text-center">
                                                                    <div className="text-sm font-bold text-white mb-1 uppercase tracking-wider">{type.label}</div>
                                                                    <div className="text-[10px] text-muted-foreground leading-relaxed font-medium">{type.desc}</div>
                                                                </div>
                                                                {field.value === type.id && (
                                                                    <div className="absolute top-2 right-2">
                                                                        <Check className="h-4 w-4 text-brand" />
                                                                    </div>
                                                                )}
                                                            </FormLabel>
                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-center justify-between gap-2 mb-2">
                                                    <FormLabel className="m-0">Description</FormLabel>
                                                    <AiButton
                                                        endpoint="/api/api/ai/description"
                                                        payload={{
                                                            title: form.getValues("title"),
                                                            type: form.getValues("type"),
                                                            price: form.getValues("price")
                                                        }}
                                                        onStream={(chunk) => {
                                                            const current = form.getValues("description");
                                                            if (chunk === "") form.setValue("description", "");
                                                            else form.setValue("description", current + chunk);
                                                        }}
                                                        label="AI Description"
                                                        variant="brand"
                                                        size="sm"
                                                    />
                                                </div>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Tell your story. What transformation are you providing?"
                                                        className="bg-surface-raised border-border min-h-[140px] resize-none leading-relaxed"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="flex items-center justify-between gap-2 mb-1">
                                                        <FormLabel>Current Price</FormLabel>
                                                        <AiButton
                                                            endpoint="/api/ai/price"
                                                            payload={{
                                                                productType: form.getValues("type"),
                                                                description: form.getValues("description"),
                                                                niche: "content creation"
                                                            }}
                                                            onData={(data) => {
                                                                form.setValue("price", data.suggestedPrice);
                                                                toast.success(`AI suggests ${formatPrice(data.suggestedPrice)}: ${data.reasoning}`);
                                                            }}
                                                            variant="accent"
                                                            size="icon"
                                                        />
                                                    </div>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                                            <Input type="number" step="0.01" className="pl-6 bg-surface-raised border-border" {...field} />
                                                            <span className="absolute right-3 top-2.5 text-[10px] font-bold text-muted-foreground uppercase">
                                                                {field.value === 0 ? "FREE" : "USD"}
                                                            </span>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="comparePrice"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Compare At Price</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                                            <Input type="number" step="0.01" className="pl-6 bg-surface-raised border-border" {...field} />
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription className="text-[10px]">Shows as crossed out.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="media" className="mt-0 space-y-6">
                                    <div className="space-y-4">
                                        <FormLabel>Cover Image</FormLabel>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="border-2 border-dashed border-border rounded-xl aspect-video flex flex-col items-center justify-center bg-surface-raised/30 hover:bg-surface-raised/50 transition-all group">
                                                <Upload className="h-8 w-8 text-muted-foreground group-hover:text-brand transition-colors mb-2" />
                                                <p className="text-sm font-medium text-white">Drag & drop image</p>
                                                <p className="text-xs text-muted-foreground font-medium">PNG, JPG up to 10MB</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Preview</p>
                                                <div className="rounded-xl border border-border aspect-video bg-surface overflow-hidden flex items-center justify-center relative">
                                                    {form.getValues("coverImage") ? (
                                                        <Image src={form.getValues("coverImage")!} alt="Preview" fill className="object-cover" />
                                                    ) : (
                                                        <Sparkles className="h-10 w-10 text-brand/20 opacity-40 animate-pulse" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {form.getValues("type") === "DIGITAL" && (
                                        <div className="p-6 border border-brand/20 bg-brand/5 rounded-xl space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                                                    <Upload className="h-4 w-4" />
                                                </div>
                                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Product File</h4>
                                            </div>
                                            <Input type="file" className="bg-surface-raised border-border" />
                                            <p className="text-[10px] text-muted-foreground">Customers receive a secure, expiring link after purchase.</p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="settings" className="mt-0 space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Custom URL Slug</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-2.5 text-xs text-muted-foreground font-bold">biopage.store/me/</span>
                                                        <Input className="pl-32 bg-surface-raised border-border font-mono text-sm" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="p-4 rounded-xl border border-border bg-surface-raised/50 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Publish Status</h4>
                                                <p className="text-xs text-muted-foreground">Make this product visible on your page.</p>
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="published"
                                                render={({ field }) => (
                                                    <RadioGroup
                                                        defaultValue={field.value ? "true" : "false"}
                                                        onValueChange={(val) => field.onChange(val === "true")}
                                                        className="flex gap-2"
                                                    >
                                                        <FormLabel className={cn(
                                                            "cursor-pointer px-4 py-2 rounded-lg border border-border text-xs font-bold uppercase transition-all",
                                                            !field.value && "bg-destructive/10 border-destructive/20 text-destructive shadow-[0_0_10px_-2px] shadow-destructive/20"
                                                        )}>
                                                            <RadioGroupItem value="false" className="sr-only" />
                                                            Draft
                                                        </FormLabel>
                                                        <FormLabel className={cn(
                                                            "cursor-pointer px-4 py-2 rounded-lg border border-border text-xs font-bold uppercase transition-all",
                                                            field.value && "bg-accent/10 border-accent/20 text-accent shadow-[0_0_10px_-2px] shadow-accent/20"
                                                        )}>
                                                            <RadioGroupItem value="true" className="sr-only" />
                                                            Live
                                                        </FormLabel>
                                                    </RadioGroup>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>

                        <DialogFooter className="p-6 border-t border-border bg-surface-raised/20">
                            <Button type="button" variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-white">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-brand text-white hover:bg-brand/90 px-8 font-bold shadow-brand/20 shadow-lg"
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                                {initialData ? "Save Changes" : "Create Product"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
