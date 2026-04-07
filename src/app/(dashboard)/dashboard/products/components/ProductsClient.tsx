"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/products/ProductForm";

export function ProductsClient({ showButton }: { showButton?: boolean }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {(showButton || !showButton) && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="bg-brand text-white hover:bg-brand/90 font-bold px-6 shadow-brand/20 shadow-lg group relative h-11"
                >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
                    <Plus className="h-4 w-4 mr-2" />
                    <span>Add Product</span>
                </Button>
            )}

            <ProductForm
                open={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}
