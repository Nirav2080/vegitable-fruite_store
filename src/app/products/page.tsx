
'use client';

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/actions/products";
import { ProductCard } from "@/components/products/ProductCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const categories = ["Fruits", "Vegetables", "Organic Boxes"];
const filters = [
  { id: 'organic', label: 'Organic' },
  { id: 'seasonal', label: 'Seasonal' }
];

function ProductsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                     <Skeleton className="h-8 w-1/3" />
                </div>
            ))}
        </div>
    )
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
        setIsLoading(true);
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
        setIsLoading(false);
    }
    loadProducts();
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline">All Produce</h1>
        <p className="mt-2 text-muted-foreground">Fresh from the farm, ready for your kitchen.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        <aside className="md:col-span-1">
          <div className="sticky top-24">
            <h2 className="text-xl font-semibold mb-4 font-headline">Filters</h2>
            <Accordion type="multiple" defaultValue={['category', 'attributes']} className="w-full">
              <AccordionItem value="category">
                <AccordionTrigger className="font-semibold">Category</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={`cat-${category}`} />
                        <Label htmlFor={`cat-${category}`}>{category}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="attributes">
                <AccordionTrigger className="font-semibold">Attributes</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-2">
                    {filters.map((filter) => (
                      <div key={filter.id} className="flex items-center space-x-2">
                        <Checkbox id={filter.id} />
                        <Label htmlFor={filter.id}>{filter.label}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button className="w-full mt-6">Apply Filters</Button>
          </div>
        </aside>

        <main className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">{isLoading ? 'Loading...' : `${products.length} products found`}</p>
            <Select defaultValue="popularity">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isLoading ? <ProductsSkeleton /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                <ProductCard key={product.id} product={product} />
                ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
