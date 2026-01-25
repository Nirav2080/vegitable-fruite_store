
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
  
  return (
    <>
      <div className="text-left mb-10">
        <h2 className="text-3xl font-bold font-headline">
          Popular Products
        </h2>
      </div>
       <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
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
    </>
  );
}
