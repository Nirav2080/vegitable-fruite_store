
'use client'

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";


interface HomePageClientProps {
    bestSellingProducts: Product[];
    filterCategories: string[];
}

export function HomePageClient({ bestSellingProducts, filterCategories }: HomePageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredBestSelling = useMemo(() => {
    if (selectedCategory === 'All') {
      return bestSellingProducts;
    }
    return bestSellingProducts.filter(p => p.category === selectedCategory);
  }, [selectedCategory, bestSellingProducts]);
  
  return (
    <section className="container mx-auto px-4 pb-16 md:pb-24">
      <div className="text-left mb-10">
        <h2 className="text-3xl font-bold font-headline">
          Todays Best Selling Product!
        </h2>
      </div>
       <div className="flex flex-wrap gap-2 mb-8">
          {filterCategories.map(category => (
              <Button 
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className={cn(
                      "rounded-full",
                      selectedCategory === category ? "bg-primary text-primary-foreground" : "bg-white"
                  )}
                  onClick={() => setSelectedCategory(category)}
              >
                  {category}
              </Button>
          ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
          {filteredBestSelling.map((product) => (
              <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </section>
  );
}
