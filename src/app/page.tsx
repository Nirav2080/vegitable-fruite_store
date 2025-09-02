

import React from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { ArrowRight, Leaf, Package, Carrot } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/lib/actions/products";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";


export default async function Home() {
  const allProducts = await getProducts();
  const featuredProducts = allProducts.filter(p => p.isSeasonal).slice(0, 8);
  
  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <section className="w-full">
         <HeroCarousel />
      </section>
      
      <section className="container mx-auto px-4 mt-8 md:mt-12">
        <h2 className="text-3xl font-bold text-center font-headline relative pb-4">
            Featured Products
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-primary"></div>
        </h2>
        <p className="mt-4 text-center text-muted-foreground max-w-xl mx-auto">Check out this week's seasonal picks, offering the best value and freshness.</p>
        
        <div className="relative -mx-2">
            <Carousel 
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full mt-8"
            >
                <CarouselContent>
                {featuredProducts.map((product) => (
                    <CarouselItem key={product.id} className="basis-1/2 md:basis-1/4">
                        <ProductCard product={product} />
                    </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
                <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
            </Carousel>
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
