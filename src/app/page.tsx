
import React, { Suspense } from "react";
import { getProducts, getCategories, getActiveOffers, getActiveBanners } from "@/lib/cached-data";
import { FeaturedCategories } from "@/components/layout/FeaturedCategories";
import { DealsSection } from "@/components/layout/DealsSection";
import { PopularProductsSection as PopularProductsSlider } from "@/components/layout/PopularProductsSection";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import { TrustSection } from "@/components/layout/TrustSection";
import { BestSellersSection } from "@/components/layout/BestSellersSection";
import { OffersSection } from "@/components/layout/OffersSection";
import { ShopByBrandSection } from "@/components/layout/ShopByBrandSection";

async function getPageData() {
  try {
    const [products, categories, offers, banners] = await Promise.all([
      getProducts(),
      getCategories(),
      getActiveOffers(),
      getActiveBanners(),
    ]);
    
    const popularProducts = products.filter(p => p.isFeatured).slice(0, 8);
    const organicProducts = products.filter(p => p.isOrganic).slice(0, 4);
    const dealProducts = products.filter(p => p.isDeal).slice(0,4);

    return { categories, popularProducts, organicProducts, dealProducts, offers, banners };
  } catch (error) {
    console.error("Failed to fetch page data, returning default values:", error);
    // Return default empty values if there's an error (e.g., DB connection issue)
    return {
      categories: [],
      popularProducts: [],
      organicProducts: [],
      dealProducts: [],
      offers: [],
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
  const { categories, popularProducts, organicProducts, dealProducts, offers, banners } = await getPageData();
  const filterCategories = ['All', ...categories.slice(0, 6).map(c => c.name)];
  
  return (
    <div className="flex flex-col">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroCarousel banners={banners} />
      </Suspense>
      
      {/* Section 1 — ODD (white) — BestSellers */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl w-full px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 overflow-hidden">
          <Suspense fallback={<ProductsGridSkeleton />}>
            <BestSellersSection 
              products={popularProducts} 
              categories={filterCategories} 
            />
          </Suspense>
        </div>
      </section>

      {/* Section 2 — EVEN (tinted) — FeaturedCategories */}
      <section className="bg-secondary/30 py-16 sm:py-20 md:py-24">
        <FeaturedCategories />
      </section>

      {/* Section 3 — ODD (white) — DealsSection */}
      <Suspense fallback={<Skeleton className="h-72 w-full rounded-none" />}>
        <DealsSection products={dealProducts} />
      </Suspense>

      {/* Section 4 — EVEN (tinted) — OffersSection */}
      <Suspense fallback={<Skeleton className="h-64 w-full rounded-none" />}>
        <OffersSection offers={offers} />
      </Suspense>

      {/* Section 5 — ODD (white) — TrustSection */}
      <TrustSection />

      {/* Section 6 — EVEN (tinted) — PopularProducts */}
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-none" />}>
        <PopularProductsSlider products={organicProducts} title="Fresh Fruits & Vegetables" link="/products?filter=isOrganic" />
      </Suspense>

      {/* Section 7 — ODD (white) — ShopByBrand */}
      <Suspense fallback={<Skeleton className="h-72 w-full rounded-none" />}>
        <ShopByBrandSection />
      </Suspense>

    </div>
  );
}
