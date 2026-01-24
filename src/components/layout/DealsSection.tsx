
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "../products/ProductCard";
import type { Product } from "@/lib/types";

interface DealsSectionProps {
    products: Product[];
}

export function DealsSection({ products }: DealsSectionProps) {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className="bg-secondary/50">
            <div className="container mx-auto px-4 py-16">
                 <div className="text-left mb-10">
                    <h2 className="text-3xl font-bold font-headline">
                    Today's Deals
                    </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
