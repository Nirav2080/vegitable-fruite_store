
import React, { Suspense } from "react";
import { getProducts, getCategories } from "@/lib/cached-data";
import { FeaturedCategories } from "@/components/layout/FeaturedCategories";
import { DealsSection } from "@/components/layout/DealsSection";
import { PopularProductsSection } from "@/components/layout/PopularProductsSection";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import { TrustSection } from "@/components/layout/TrustSection";
import { TestimonialsSection } from "@/components/layout/TestimonialsSection";
import { BestSellersSection } from "@/components/layout/BestSellersSection";

async function getPageData() {
  try {
    const products = await getProducts();
    const categories = await getCategories();
    const bestSellingProducts = products.filter(p => p.isPopular).slice(0, 8);
    const popularProducts = products.filter(p => p.isPopular).slice(0, 8);
    const organicProducts = products.filter(p => p.isOrganic).slice(0, 4);
    const dealProducts = products.filter(p => p.isDeal).slice(0,4);

    return { categories, bestSellingProducts, popularProducts, organicProducts, dealProducts };
  } catch (error) {
    console.error("Failed to fetch page data, returning default values:", error);
    // Return default empty values if there's an error (e.g., DB connection issue)
    return {
      categories: [],
      bestSellingProducts: [],
      popularProducts: [],
      organicProducts: [],
      dealProducts: [],
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

function ProductsGridSkeleton() {
  return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
        {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
            </div>
        ))}
      </div>
  )
}


export default async function Home() {
  const { categories, bestSellingProducts, popularProducts, organicProducts, dealProducts } = await getPageData();
  const filterCategories = ['All', ...categories.slice(0, 6).map(c => c.name)];
  
  return (
    <div className="flex flex-col">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroCarousel />
      </Suspense>

      <section className="py-16 md:py-24">
        <FeaturedCategories />
      </section>
      
      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <Suspense fallback={<ProductsGridSkeleton />}>
          <BestSellersSection 
            products={bestSellingProducts} 
            categories={filterCategories} 
          />
        </Suspense>
      </section>

      <Suspense fallback={<Skeleton className="h-72 w-full" />}>
        <DealsSection products={dealProducts} />
      </Suspense>

      <TrustSection />

      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <PopularProductsSection products={popularProducts} title="Popular Products" link="/products?sort=popularity" />
      </Suspense>

       <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <PopularProductsSection products={organicProducts} title="Seasonal & Organic Picks" link="/products?filter=isOrganic" />
      </Suspense>

      <TestimonialsSection />

    </div>
  );
}
