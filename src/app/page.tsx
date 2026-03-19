
import React, { Suspense } from "react";
import { getProducts, getCategories, getActiveBanners } from "@/lib/cached-data";
import { FeaturedCategories } from "@/components/layout/FeaturedCategories";
import { PopularProductsSection as PopularProductsSlider } from "@/components/layout/PopularProductsSection";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import { TrustSection } from "@/components/layout/TrustSection";
import { BestSellersSection } from "@/components/layout/BestSellersSection";

async function getPageData() {
  try {
    const [products, categories, banners] = await Promise.all([
      getProducts(),
      getCategories(),
      getActiveBanners(),
    ]);
    
    // Sort all products by date for the "All Products" section (newest first)
    const allProducts = [...products].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Filter popular products for the "Popular Products" slider
    const popularProducts = products.filter(p => p.isFeatured).slice(0, 10);

    return { products: allProducts, categories, popularProducts, banners };
  } catch (error) {
    console.error("Failed to fetch page data, returning default values:", error);
    return {
      products: [],
      categories: [],
      popularProducts: [],
      banners: [],
    };
  }
}

function HeroSkeleton() {
  return (
     <section className="bg-secondary/30">
        <div className="container mx-auto px-4 grid md:grid-cols-2 items-center gap-8">
            <div className="py-12 md:py-24 text-center md:text-left space-y-4">
                <Skeleton className="h-5 w-32 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-5 w-4/5 rounded-lg" />
                <Skeleton className="h-12 w-36 rounded-xl mt-4" />
            </div>
             <div className="relative h-[400px]">
                <Skeleton className="w-full h-full rounded-2xl" />
            </div>
        </div>
      </section>
  )
}

function ProductsGridSkeleton() {
  return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-2xl border border-border/30 p-4">
                <Skeleton className="aspect-[4/3.5] w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                <Skeleton className="h-3 w-1/2 rounded-lg" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-5 w-16 rounded-lg" />
                  <Skeleton className="h-9 w-16 rounded-xl" />
                </div>
            </div>
        ))}
      </div>
  )
}


export default async function Home() {
  const { products, categories, popularProducts, banners } = await getPageData();
  const filterCategories = ['All', ...categories.map(c => c.name)];
  
  return (
    <div className="flex flex-col">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroCarousel banners={banners} />
      </Suspense>
      
      {/* 2. All Products with category filter */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl w-full px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 overflow-hidden">
          <Suspense fallback={<ProductsGridSkeleton />}>
            <BestSellersSection 
              products={products} 
              categories={filterCategories}
              title="All Products"
              subtitle="Our Selection"
            />
          </Suspense>
        </div>
      </section>

      {/* 3. Categories */}
      <section className="bg-secondary/30 py-16 sm:py-20 md:py-24">
        <FeaturedCategories />
      </section>

      {/* 4. Popular products without filter */}
      <section className="bg-background">
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-none" />}>
          <PopularProductsSlider products={popularProducts} title="Popular Products" link="/products?filter=isFeatured" />
        </Suspense>
      </section>

      {/* 5. Our Promise */}
      <TrustSection />

    </div>
  );
}
