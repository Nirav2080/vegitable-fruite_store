
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/cached-data';
import type { Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

function CategorySkeleton() {
    return (
        <div className="flex flex-col items-center gap-3">
            <Skeleton className="h-32 w-32 rounded-lg" />
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

    const categoryBackgrounds = [
        'bg-green-100/50',
        'bg-blue-100/50',
        'bg-purple-100/50',
        'bg-yellow-100/50',
        'bg-pink-100/50',
        'bg-indigo-100/50',
    ]

    return (
        <div className="container mx-auto px-4">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold font-headline">
                    Choose Your Featured Categories
                </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)
                ) : (
                    categories.slice(0, 6).map((category, index) => (
                        <Link key={category.id} href={`/products?categoryId=${category.id}`} className="group block text-center">
                            <div className={`relative aspect-square w-full rounded-lg ${categoryBackgrounds[index % categoryBackgrounds.length]} flex items-center justify-center border-2 border-transparent group-hover:border-primary group-hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-2 p-4`}>
                                {category.icon ? (
                                    <Image 
                                        src={category.icon}
                                        alt={category.name}
                                        width={120}
                                        height={120}
                                        className="object-contain"
                                    />
                                ) : (
                                    <span className="text-primary text-sm font-semibold px-2">{category.name}</span>
                                )}
                            </div>
                            <h3 className="font-semibold text-base mt-3 group-hover:text-primary transition-colors">{category.name}</h3>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
