
import React from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/lib/cached-data";
import { FeaturedCategories } from "@/components/layout/FeaturedCategories";
import Image from "next/image";
import { DealsSection } from "@/components/layout/DealsSection";
import { InfoSection } from "@/components/layout/InfoSection";
import { CallToActionSection } from "@/components/layout/CallToActionSection";

export default async function Home() {
  const allProducts = await getProducts();
  const bestSellingProducts = allProducts.slice(0, 8);
  const popularProducts = allProducts.slice(8, 12);
  
  return (
    <div className="flex flex-col">
      <section className="bg-accent">
        <div className="container mx-auto px-4 grid md:grid-cols-2 items-center gap-8">
            <div className="py-12 md:py-24 text-center md:text-left">
                <p className="text-primary font-semibold tracking-wider">Welcome to a Culinary Paradise</p>
                <h1 className="text-4xl md:text-6xl font-bold font-headline mt-2">
                    Indulge in Exquisite Flavors with FoodieCart
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
                    Discover a world of exceptional tastes curated just for you. From farm-fresh produce to gourmet delicacies, our handpicked.
                </p>
                <Button asChild size="lg" className="mt-8 rounded-md">
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
            </div>
             <div className="relative h-64 md:h-auto self-end">
                <div className="absolute bottom-0 right-0 w-[80%] h-[80%] bg-primary/80 rounded-full" />
                 <Image
                    src="https://picsum.photos/seed/hero-woman/600/600"
                    alt="Woman holding a basket of fresh groceries"
                    data-ai-hint="woman groceries"
                    width={600}
                    height={600}
                    className="relative z-10 w-full max-w-md mx-auto"
                />
            </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <FeaturedCategories />
      </section>

      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-headline">
            Today's Best Selling Products!
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {bestSellingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>

      <DealsSection />

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold font-headline">
            Popular Food Items
          </h2>
           <Button variant="outline" asChild className="rounded-full">
                <Link href="/products?sort=popularity">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>
      
      <CallToActionSection />
      <InfoSection />

    </div>
  );
}
