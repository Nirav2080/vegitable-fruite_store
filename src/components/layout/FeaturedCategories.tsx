
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/cached-data';
import type { Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

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

    const displayedCategories = categories.slice(0, 8);
    const skeletonCount = 8;


    return (
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold font-headline">
                    Shop by Categories
                </h2>
                 <Button asChild variant="link" className="hidden md:flex">
                    <Link href="/products">
                        View All <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                {isLoading ? (
                    Array.from({ length: skeletonCount }).map((_, i) => <CategorySkeleton key={i} />)
                ) : (
                    displayedCategories.map((category) => (
                        <Link key={category.id} href={`/products?categoryId=${category.id}`} className="group block">
                             <div className="bg-background border rounded-lg p-4 flex flex-col items-center justify-start aspect-square transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                                <div className="relative w-full h-2/3 bg-muted rounded-md overflow-hidden">
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
                    ))
                )}
            </div>
        </div>
    );
}
