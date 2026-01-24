
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/lib/cached-data";
import { ProductCard } from "../products/ProductCard";

export async function DealsSection() {
    let dealProducts = [];
    try {
        const allProducts = await getProducts();
        dealProducts = allProducts.filter(p => p.isDeal).slice(0, 4);
    } catch (error) {
        console.error("Failed to fetch deal products:", error);
    }

    if (dealProducts.length === 0) {
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
                    {dealProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
