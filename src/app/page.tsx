
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
import { HeroCarousel } from "@/components/layout/HeroCarousel";

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

function HeroSkeleton() {
  return (
     <section className="bg-accent">
        <div className="container mx-auto px-4 grid md:grid-cols-2 items-center gap-8">
            <div className="py-12 md:py-24 text-center md:text-left">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-12 w-full mt-4" />
                <Skeleton className="h-6 w-4/5 mt-4" />
                <Skeleton className="h-12 w-32 mt-8" />
            </div>
             <div className="relative h-[500px]">
                <Skeleton className="w-full h-full" />
            </div>
        </div>
      </section>
  )
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
      <Suspense fallback={<HeroSkeleton />}>
        <HeroCarousel />
      </Suspense>

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
