

import React from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { ArrowRight, Leaf, Package, Carrot } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/lib/actions/products";
import { HeroCarousel } from "@/components/layout/HeroCarousel";


export default async function Home() {
  const allProducts = await getProducts();
  const weeklySpecials = allProducts.filter(p => p.isSeasonal).slice(0, 4);
  
  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <section className="w-full">
         <HeroCarousel />
      </section>
      
      <section className="container mx-auto px-4 mt-8 md:mt-12">
        <h2 className="text-3xl font-bold text-center font-headline">Weekly Specials</h2>
        <p className="mt-2 text-center text-muted-foreground max-w-xl mx-auto">Check out this week's seasonal picks, offering the best value and freshness.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-8">
          {weeklySpecials.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link href="/products">View All Products <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

    </div>
  );
}
