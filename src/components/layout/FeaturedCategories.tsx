
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/cached-data';
import type { Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

function CategorySkeleton() {
    return (
        <div className="bg-background border rounded-lg p-4 flex flex-col items-center justify-start aspect-square">
            <div className="relative w-full h-2/3 bg-muted rounded-md overflow-hidden">
                <Skeleton className="h-full w-full" />
            </div>
            <Skeleton className="h-5 w-20 mt-3" />
        </div>
    )
}

export function FeaturedCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const fetchedCategories = await getCategories();
                // We only want top-level categories here
                const topLevelCategories = fetchedCategories.filter(c => !c.parentId);
                setCategories(topLevelCategories);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCategories();
    }, []);

    const skeletonCount = 8;

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-2">Categories</p>
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Shop by Categories
                    </h2>
                </div>
                <Button asChild variant="outline" size="sm" className="hidden md:flex rounded-xl border-border/40 text-muted-foreground transition-all duration-200 hover:text-foreground hover:border-border/60">
                    <Link href="/products">
                        View All <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                </Button>
            </div>
            <Carousel
                opts={{ align: "start", loop: categories.length > 8 }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {categories.map((category) => (
                        <CarouselItem key={category.id} className="basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-1/8 pl-4">
                            <Link href={`/products?category=${encodeURIComponent(category.name)}`} className="group block">
                                <div className="bg-card border border-border/30 rounded-2xl p-4 flex flex-col items-center justify-start aspect-square transition-all duration-300 group-hover:shadow-lg group-hover:shadow-black/[0.03] group-hover:-translate-y-1 group-hover:border-border/50">
                                    <div className="relative w-full h-2/3 bg-secondary/40 rounded-xl overflow-hidden">
                                        {category.icon ? (
                                            <Image
                                                src={category.icon}
                                                alt={category.name}
                                                fill
                                                className="object-contain transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-gray-200 rounded-md" />
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-sm mt-3 text-center text-foreground truncate w-full">{category.name}</h3>
                                </div>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-xl border border-border/30 bg-card/80 backdrop-blur-sm hover:bg-card hover:shadow-md" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-xl border border-border/30 bg-card/80 backdrop-blur-sm hover:bg-card hover:shadow-md" />
            </Carousel>
        </div>
    );
}
