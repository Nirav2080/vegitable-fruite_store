
'use client';

import { useEffect, useState, useMemo } from "react";
import { getProducts, getCategories, getAttributes } from "@/lib/cached-data";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductListCard } from "@/components/products/ProductListCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Product, Category, Attribute } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

function ProductsSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
    categories: Category[];
    attributes: Attribute[];
    selectedFilters: Record<string, string[]>;
    handleFilterChange: (filterName: string, value: string) => void;
}

function FilterSidebarContent({ categories, attributes, selectedFilters, handleFilterChange }: FilterSidebarContentProps) {
    const isOrganicChecked = selectedFilters['isOrganic']?.includes('true') || false;
    const isDealChecked = selectedFilters['isDeal']?.includes('true') || false;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Filter By</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Accordion type="multiple" defaultValue={['category', 'attributes']} className="w-full">
                        <AccordionItem value="category">
                            <AccordionTrigger className="font-semibold px-6">Category</AccordionTrigger>
                            <AccordionContent className="px-6">
                                <div className="grid gap-2">
                                    {categories.map((category) => (
                                        <div key={category.id}>
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor={`cat-${category.id}`} className="flex items-center gap-2 font-normal cursor-pointer">
                                                    <Checkbox 
                                                        id={`cat-${category.id}`}
                                                        checked={selectedFilters['categoryId']?.includes(category.id)}
                                                        onCheckedChange={() => handleFilterChange('categoryId', category.id)}
                                                    />
                                                    {category.name}
                                                </Label>
                                            </div>
                                            {category.subcategories && category.subcategories.length > 0 && (
                                                <div className="pl-6 pt-2 grid gap-2">
                                                    {category.subcategories.map(sub => (
                                                        <div key={sub.id} className="flex items-center justify-between">
                                                            <Label htmlFor={`cat-${sub.id}`} className="flex items-center gap-2 font-normal cursor-pointer">
                                                                <Checkbox 
                                                                    id={`cat-${sub.id}`}
                                                                    checked={selectedFilters['categoryId']?.includes(sub.id)}
                                                                    onCheckedChange={() => handleFilterChange('categoryId', sub.id)}
                                                                />
                                                                {sub.name}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="attributes">
                             <AccordionTrigger className="font-semibold px-6">Attributes</AccordionTrigger>
                             <AccordionContent className="px-6">
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="isOrganic" className="flex items-center gap-2 font-normal cursor-pointer">
                                            <Checkbox
                                                id="isOrganic"
                                                checked={isOrganicChecked}
                                                onCheckedChange={() => handleFilterChange('isOrganic', 'true')}
                                            />
                                            Fresh
                                        </Label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="isDeal" className="flex items-center gap-2 font-normal cursor-pointer">
                                            <Checkbox
                                                id="isDeal"
                                                checked={isDealChecked}
                                                onCheckedChange={() => handleFilterChange('isDeal', 'true')}
                                            />
                                            Deals
                                        </Label>
                                    </div>
                                    {attributes.map((attribute) => (
                                        <div key={attribute.id}>
                                            <p className="font-medium my-2">{attribute.name}</p>
                                            {attribute.values.map(value => (
                                                 <div key={value} className="flex items-center justify-between">
                                                    <Label htmlFor={`${attribute.name}-${value}`} className="flex items-center gap-2 font-normal cursor-pointer">
                                                        <Checkbox
                                                            id={`${attribute.name}-${value}`}
                                                            checked={selectedFilters[attribute.name]?.includes(value)}
                                                            onCheckedChange={() => handleFilterChange(attribute.name, value)}
                                                        />
                                                        {value}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    )
}


export default function ProductsPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function loadData() {
        setIsLoading(true);
        try {
            const [fetchedProducts, fetchedCategories, fetchedAttributes] = await Promise.all([
                getProducts(),
                getCategories(true),
                getAttributes(),
            ]);
            setProducts(fetchedProducts);
            setCategories(fetchedCategories);
            setAttributes(fetchedAttributes);
        } catch (error) {
            console.error("Failed to load products page data:", error);
            toast({
                title: "Error",
                description: "Could not load products. Please try again later.",
                variant: "destructive"
            });
            // Set to empty arrays to prevent crash
            setProducts([]);
            setCategories([]);
            setAttributes([]);
        }
        
        const initialFilters: Record<string, string[]> = {};
        const categoryId = searchParams.get('categoryId');
        if (categoryId) {
            initialFilters['categoryId'] = [categoryId];
        }
        
        const filter = searchParams.get('filter');
        if (filter === 'isOrganic') {
            initialFilters['isOrganic'] = ['true'];
        }
        if (filter === 'isDeal') {
            initialFilters['isDeal'] = ['true'];
        }
        
        setSelectedFilters(initialFilters);
        setIsLoading(false);
    }
    loadData();
  }, [searchParams, toast])

  const handleFilterChange = (filterName: string, value: string) => {
    setSelectedFilters(prev => {
        const currentValues = prev[filterName] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        
        const newFilters = { ...prev, [filterName]: newValues };
        
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
            if (filterName === 'categoryId') {
                return selectedValues.includes(product.categoryId as string);
            }
            if (filterName === 'isOrganic') {
                return product.isOrganic;
            }
            if (filterName === 'isDeal') {
                return product.isDeal;
            }
            // For other attributes, just return true for now to avoid crashing.
            // A more complex logic would be needed if products had these attributes.
            const attribute = attributes.find(attr => attr.name === filterName);
            if (attribute) {
                return true;
            }
            return true;
        });
    });
  }, [products, selectedFilters, attributes]);


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <aside className="hidden lg:block lg:col-span-1 sticky top-24">
            <FilterSidebarContent 
                categories={categories}
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
          
          <div className="hidden lg:flex justify-between items-center mb-6 p-4 border rounded-lg bg-muted/50">
            <div className='flex items-center gap-4'>
                <div className="flex items-center gap-2">
                    <Button variant={viewMode === 'grid' ? 'outline' : 'ghost'} size="icon" className="bg-background" onClick={() => setViewMode('grid')}><LayoutGrid className="h-5 w-5" /></Button>
                    <Button variant={viewMode === 'list' ? 'outline' : 'ghost'} size="icon" onClick={() => setViewMode('list')}><List className="h-5 w-5" /></Button>
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
                           categories={categories}
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
              <Button variant={viewMode === 'grid' ? 'outline' : 'ghost'} size="icon" className="bg-background" onClick={() => setViewMode('grid')}><LayoutGrid className="h-5 w-5" /></Button>
              <Button variant={viewMode === 'list' ? 'outline' : 'ghost'} size="icon" onClick={() => setViewMode('list')}><List className="h-5 w-5" /></Button>
            </div>
          </div>


          {isLoading ? <ProductsSkeleton /> : (
            viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredProducts.map((product) => (
                        <ProductListCard key={product.id} product={product} />
                    ))}
                </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}
