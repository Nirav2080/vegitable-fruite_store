
'use client';

import { useEffect, useState, useMemo } from "react";
import { getProducts } from "@/lib/actions/products";
import { ProductCard } from "@/components/products/ProductCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Product, Attribute } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getAttributes } from "@/lib/actions/attributes";

const staticCategories = ["Fruits", "Vegetables", "Organic Boxes"];

function ProductsSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

interface FilterSidebarContentProps {
    attributes: Attribute[];
    selectedFilters: Record<string, string[]>;
    handleFilterChange: (filterName: string, value: string) => void;
}

function FilterSidebarContent({ attributes, selectedFilters, handleFilterChange }: FilterSidebarContentProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Filter By</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Accordion type="multiple" defaultValue={['category', ...attributes.map(a => a.name)]} className="w-full">
                        <AccordionItem value="category">
                            <AccordionTrigger className="font-semibold px-6">Category</AccordionTrigger>
                            <AccordionContent className="px-6">
                                <div className="grid gap-2">
                                    {staticCategories.map((category) => (
                                        <div key={category} className="flex items-center justify-between">
                                            <Label htmlFor={`cat-${category}`} className="flex items-center gap-2 font-normal cursor-pointer">
                                                <Checkbox 
                                                    id={`cat-${category}`}
                                                    checked={selectedFilters['category']?.includes(category)}
                                                    onCheckedChange={() => handleFilterChange('category', category)}
                                                />
                                                {category}
                                            </Label>
                                            {/* <span className="text-sm text-muted-foreground">(10)</span> */}
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        {attributes.map((attribute) => (
                             <AccordionItem key={attribute.id} value={attribute.name}>
                                <AccordionTrigger className="font-semibold px-6">{attribute.name}</AccordionTrigger>
                                <AccordionContent className="px-6">
                                    <div className="grid gap-2">
                                    {attribute.values.map((value) => (
                                        <div key={value} className="flex items-center justify-between">
                                            <Label htmlFor={`attr-${attribute.name}-${value}`} className="flex items-center gap-2 font-normal cursor-pointer">
                                                <Checkbox 
                                                    id={`attr-${attribute.name}-${value}`}
                                                    checked={selectedFilters[attribute.name]?.includes(value)}
                                                    onCheckedChange={() => handleFilterChange(attribute.name, value)}
                                                />
                                                {value}
                                            </Label>
                                            {/* <span className="text-sm text-muted-foreground">(5)</span> */}
                                        </div>
                                    ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    )
}


export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  useEffect(() => {
    async function loadData() {
        setIsLoading(true);
        const [fetchedProducts, fetchedAttributes] = await Promise.all([
            getProducts(),
            getAttributes()
        ]);
        setProducts(fetchedProducts);
        setAttributes(fetchedAttributes);
        setIsLoading(false);
    }
    loadData();
  }, [])

  const handleFilterChange = (filterName: string, value: string) => {
    setSelectedFilters(prev => {
        const currentValues = prev[filterName] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        
        const newFilters = { ...prev, [filterName]: newValues };
        
        // If all values for a filter are unchecked, remove the filter name from the state
        if (newValues.length === 0) {
            delete newFilters[filterName];
        }
        
        return newFilters;
    });
  }

  const filteredProducts = useMemo(() => {
    if (Object.keys(selectedFilters).length === 0) {
        return products;
    }

    return products.filter(product => {
        return Object.entries(selectedFilters).every(([filterName, selectedValues]) => {
            if (!selectedValues || selectedValues.length === 0) {
                return true;
            }
            if (filterName === 'category') {
                return selectedValues.includes(product.category);
            }
            // This is a placeholder for filtering by dynamic attributes.
            // You would need to add attributes to your product type to make this work.
            // For now, it will not filter by dynamic attributes as product data doesn't contain them.
            return true; 
        });
    });
  }, [products, selectedFilters]);


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <aside className="hidden lg:block lg:col-span-1 sticky top-24">
            <FilterSidebarContent 
                attributes={attributes} 
                selectedFilters={selectedFilters}
                handleFilterChange={handleFilterChange}
            />
        </aside>

        <main className="lg:col-span-3">
          <header className="mb-6">
              <h1 className="text-3xl font-bold font-headline">Organic Products</h1>
              <p className="mt-2 text-muted-foreground max-w-2xl">Discover our favorites fashionable discoveries, a selection of cool items to integrate in your wardrobe. Compose a unique style with personality which matches your own.</p>
          </header>
          
          {/* Desktop Filter Bar */}
          <div className="hidden lg:flex justify-between items-center mb-6 p-4 border rounded-lg bg-muted/50">
            <div className='flex items-center gap-4'>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="bg-background"><LayoutGrid className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon"><List className="h-5 w-5" /></Button>
                </div>
                <p className="text-muted-foreground text-sm">{isLoading ? 'Loading...' : `Showing ${filteredProducts.length} products.`}</p>
            </div>
            <div className="flex items-center gap-2">
              <Label>Sort by:</Label>
              <Select defaultValue="popularity">
                <SelectTrigger className="w-[180px] bg-background">
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
          </div>
          
          {/* Mobile Filter Bar */}
           <div className="lg:hidden flex justify-between items-center mb-6 p-2 border rounded-lg bg-muted/50">
             <Sheet>
                <SheetTrigger asChild>
                    <Button>
                        <SlidersHorizontal className="mr-2 h-4 w-4" /> Filter
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full max-w-sm flex flex-col p-0">
                   <SheetHeader className="p-6 pb-4">
                        <SheetTitle>Filter Products</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto px-6 pb-6">
                        <FilterSidebarContent 
                           attributes={attributes}
                           selectedFilters={selectedFilters}
                           handleFilterChange={handleFilterChange}
                        />
                    </div>
                </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <Select defaultValue="popularity">
                <SelectTrigger className="w-[150px] bg-background">
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
          </div>


          {isLoading ? <ProductsSkeleton /> : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
                ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
