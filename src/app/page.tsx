
'use client'

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/cached-data";
import { FeaturedCategories } from "@/components/layout/FeaturedCategories";
import Image from "next/image";
import { DealsSection } from "@/components/layout/DealsSection";
import { InfoSection } from "@/components/layout/InfoSection";
import { CallToActionSection } from "@/components/layout/CallToActionSection";
import type { Product, Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [products, cats] = await Promise.all([getProducts(), getCategories()]);
      setAllProducts(products);
      setCategories(cats);
      setBestSellingProducts(products.slice(0, 8));
      setPopularProducts(products.slice(8, 12));
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const filteredBestSelling = bestSellingProducts.filter(p => 
    selectedCategory === 'All' || p.category === selectedCategory
  );

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
                    src="https://picsum.photos/seed/h/600/600"
                    alt="Woman holding vegetables"
                    data-ai-hint="woman groceries"
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
            {isLoading ? 
              Array.from({ length: 8 }).map((_, i) => <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse" />)
              : filteredBestSelling.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>

      <DealsSection />

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold font-headline">
            Popular Food Items
          </h2>
           <Button variant="outline" asChild className="rounded-full">
                <Link href="/products?sort=popularity">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>
      
      <CallToActionSection />
      <InfoSection />

    </div>
  );
}
