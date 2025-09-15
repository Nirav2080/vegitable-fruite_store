

import React from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { ArrowRight, Leaf, Package, Carrot } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/lib/actions/products";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { FeaturedCategories } from "@/components/layout/FeaturedCategories";
import { CustomerReviews } from "@/components/layout/CustomerReviews";


export default async function Home() {
  const allProducts = await getProducts();
  const featuredProducts = allProducts.filter(p => p.isSeasonal).slice(0, 8);
  const newProducts = allProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);
  
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
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>

        <div className="text-center mt-8 mb-8">
          <Button asChild variant="outline">
            <Link href="/products">View All Products <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <section className="w-full bg-primary/10 py-12">
        <FeaturedCategories />
      </section>

      <section className="container mx-auto px-4 mb-12">
        <h2 className="text-2xl font-bold font-headline relative mb-6 pb-2">
          New Products
          <div className="absolute bottom-0 left-0 w-20 h-1 bg-primary"></div>
        </h2>
        <Carousel 
          opts={{ align: "start", loop: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {newProducts.map((product, index) => (
              <CarouselItem key={index} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
        </Carousel>
      </section>

      <section className="w-full bg-muted/50 py-16">
        <CustomerReviews />
      </section>

    </div>
  );
}
