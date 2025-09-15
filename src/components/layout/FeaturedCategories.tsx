

'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/actions/categories';
import type { Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

function CategorySkeleton() {
    return (
        <div className="flex flex-col items-center gap-3">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-5 w-24" />
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
                setCategories(fetchedCategories);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCategories();
    }, []);

    return (
        <div className="py-12 bg-muted/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center font-headline relative pb-4">
                Shop by Featured Categories
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-primary"></div>
            </h2>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-x-4 gap-y-8">
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => <CategorySkeleton key={i} />)
                ) : (
                    categories.slice(0, 8).map((category) => (
                        <Link key={category.id} href={`/products?categoryId=${category.id}`} className="group flex flex-col items-center gap-3 text-center">
                            <div className="h-32 w-32 rounded-full bg-white flex items-center justify-center border-2 border-transparent group-hover:border-primary group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 p-4">
                                {category.icon ? (
                                    <Image 
                                        src={category.icon}
                                        alt={category.name}
                                        width={100}
                                        height={100}
                                        className="object-contain"
                                    />
                                ) : (
                                    <span className="text-primary text-sm font-semibold px-2">{category.name}</span>
                                )}
                            </div>
                            <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{category.name}</h3>
                        </Link>
                    ))
                )}
            </div>
           </div>
        </div>
    );
}
