
'use client'

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { CarouselNavButtons, useProductCarousel } from "@/components/products/ProductCarousel";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BestSellersSectionProps {
    products: Product[];
    categories: string[];
}

export function BestSellersSection({ products, categories }: BestSellersSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredBestSelling = useMemo(() => {
    if (selectedCategory === 'All') {
      return products;
    }
    return products.filter(p => p.category === selectedCategory);
  }, [selectedCategory, products]);

  // Filter categories to only show those with products
  const categoriesWithProducts = useMemo(() => {
    return categories.filter(category => {
      if (category === 'All') return true;
      return products.some(p => p.category === category);
    });
  }, [categories, products]);

  const {
    emblaRef,
    canScrollPrev,
    canScrollNext,
    selectedIndex,
    scrollSnaps,
    scrollPrev,
    scrollNext,
    scrollTo,
  } = useProductCarousel(true, 5000);

  return (
    <>
      {/* Header with inline nav buttons */}
      <div className="flex items-end justify-between mb-10 gap-4">
        <div className="text-left min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-2">Trending Now</p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Popular Products
          </h2>
        </div>
        <CarouselNavButtons
          onPrev={scrollPrev}
          onNext={scrollNext}
          canScrollPrev={canScrollPrev}
          canScrollNext={canScrollNext}
        />
      </div>

      {/* Category filter pills */}
      {categoriesWithProducts.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {categoriesWithProducts.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              className={cn(
                "rounded-xl text-[13px] transition-all duration-200",
                selectedCategory === category
                  ? "shadow-sm shadow-black/[0.04]"
                  : "border-border/40 text-muted-foreground hover:text-foreground hover:border-border"
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      )}

      {/* Carousel */}
      <div className="relative">
        <div ref={emblaRef} className="overflow-hidden rounded-xl">
          <div className="flex -ml-3 md:-ml-4">
            {filteredBestSelling.map((product) => (
              <div
                key={product.id}
                className="min-w-0 shrink-0 grow-0 pl-3 md:pl-4 basis-full sm:basis-[48%] md:basis-[32%] lg:basis-[25%]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      {scrollSnaps.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                'rounded-full transition-all duration-300 ease-out',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                index === selectedIndex
                  ? 'w-7 h-2.5 bg-primary shadow-sm shadow-black/[0.06]'
                  : 'w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              )}
              aria-label={`Go to slide group ${index + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
}
