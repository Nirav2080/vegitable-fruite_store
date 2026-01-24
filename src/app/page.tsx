
import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/cached-data";
import { FeaturedCategories } from "@/components/layout/FeaturedCategories";
import Image from "next/image";
import { DealsSection } from "@/components/layout/DealsSection";
import { InfoSection } from "@/components/layout/InfoSection";
import { CallToActionSection } from "@/components/layout/CallToActionSection";
import { HomePageClient } from "./_components/HomePageClient";
import { PopularProductsSection } from "@/components/layout/PopularProductsSection";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product, Category } from "@/lib/types";

async function getPageData() {
  try {
    const [products, categories] = await Promise.all([getProducts(), getCategories()]);
    const bestSellingProducts = products.slice(0, 8);
    const popularProducts = products.filter(p => p.isPopular);
    return { categories, bestSellingProducts, popularProducts };
  } catch (error) {
    console.error("Failed to fetch page data, returning default values:", error);
    // Return default empty values if there's an error (e.g., DB connection issue)
    return {
      categories: [],
      bestSellingProducts: [],
      popularProducts: [],
    };
  }
}

function DealsSkeleton() {
  return (
    <div className="bg-secondary/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  )
}

function PopularProductsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
       <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-8 w-16" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  )
}


export default async function Home() {
  const { categories, bestSellingProducts, popularProducts } = await getPageData();
  const filterCategories = ['All', ...categories.slice(0, 6).map(c => c.name)];
  
  return (
    <div className="flex flex-col">
      <section className="bg-accent">
        <div className="container mx-auto px-4 grid md:grid-cols-2 items-center gap-8">
            <div className="py-12 md:py-24 text-center md:text-left">
                <p className="text-primary font-semibold tracking-wider">Welcome to our Culinary Paradise</p>
                <h1 className="text-4xl md:text-6xl font-bold font-headline mt-2">
                    Indulge in Exquisite Flavors with FoodieCart
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
                    From farm-fresh produce to gourmet deliveries, our handpicked selection is sure to delight your senses.
                </p>
                <Button asChild size="lg" className="mt-8 rounded-full">
                  <Link href="/products">
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Shop Now
                  </Link>
                </Button>
            </div>
             <div className="relative h-[500px]">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[70%] bg-primary/20 rounded-t-full" />
                 <Image
                    src="https://picsum.photos/seed/groceries/600/600"
                    alt="Woman holding a bag of fresh groceries"
                    data-ai-hint="fresh groceries"
                    width={600}
                    height={600}
                    className="relative z-10 w-full h-full object-contain"
                />
            </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <FeaturedCategories />
      </section>
      
      <HomePageClient 
        bestSellingProducts={bestSellingProducts} 
        filterCategories={filterCategories} 
      />

      <Suspense fallback={<DealsSkeleton />}>
        <DealsSection />
      </Suspense>

      <Suspense fallback={<PopularProductsSkeleton />}>
        <PopularProductsSection products={popularProducts} />
      </Suspense>
      
      <CallToActionSection />
      <InfoSection />

    </div>
  );
}
