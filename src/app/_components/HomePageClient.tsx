
'use client'

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
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
  
  return (
    <>
      <div className="text-left mb-10">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          Best Sellers
        </span>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight font-headline md:text-4xl">
          Best Sellers
        </h2>
      </div>
       {categoriesWithProducts.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {categoriesWithProducts.map(category => (
              <Button 
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className={cn(
                      "rounded-full transition-all duration-200",
                      selectedCategory === category ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" : "bg-white hover:shadow-sm"
                  )}
                  onClick={() => setSelectedCategory(category)}
              >
                  {category}
              </Button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
          {filteredBestSelling.map((product) => (
              <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </>
  );
}
