
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
            <div className="flex justify-between items-center mb-8">
                <div>
                    <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                        Categories
                    </span>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight font-headline md:text-3xl">
                        Shop by Categories
                    </h2>
                </div>
                <Button asChild variant="outline" className="hidden md:flex rounded-full border-primary/20 text-primary transition-all duration-200 hover:bg-primary/5 hover:shadow-sm">
                    <Link href="/products">
                        View All <ArrowRight className="ml-2 h-4 w-4" />
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
                                <div className="bg-background border border-border/60 rounded-2xl p-4 flex flex-col items-center justify-start aspect-square transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/5 group-hover:-translate-y-1 group-hover:border-primary/20">
                                    <div className="relative w-full h-2/3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl overflow-hidden">
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
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full border border-border/60 bg-background/80 backdrop-blur-sm hover:bg-background hover:shadow-md" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full border border-border/60 bg-background/80 backdrop-blur-sm hover:bg-background hover:shadow-md" />
            </Carousel>
        </div>
    );
}
