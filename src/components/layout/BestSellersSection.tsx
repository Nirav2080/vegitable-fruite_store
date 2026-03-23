
'use client'

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BestSellersSectionProps {
    products: Product[];
    categories: string[];
    title?: string;
    subtitle?: string;
}

export function BestSellersSection({ 
    products, 
    categories, 
    title = "Popular Products", 
    subtitle = "Trending Now" 
}: BestSellersSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

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

  const totalPages = Math.ceil(filteredBestSelling.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredBestSelling.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      {/* Header */}
      <div className="flex items-end justify-between mb-10 gap-4">
        <div className="text-left min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-2">{subtitle}</p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h2>
        </div>
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

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-10 w-10 rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              // Simple pagination rendering: show first, last, and pages around current
              const pageNumber = i + 1;
              if (
                pageNumber === 1 || 
                pageNumber === totalPages || 
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={i}
                    variant={currentPage === pageNumber ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={cn(
                      "h-10 w-10 rounded-full",
                      currentPage === pageNumber ? "" : "text-muted-foreground"
                    )}
                  >
                    {pageNumber}
                  </Button>
                );
              } else if (
                pageNumber === currentPage - 2 || 
                pageNumber === currentPage + 2
              ) {
                return <span key={i} className="px-1 text-muted-foreground">...</span>;
              }
              return null;
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-10 w-10 rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
}
