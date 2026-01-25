
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBrands } from '@/lib/cached-data';
import type { Brand } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

function BrandSkeleton() {
    return (
        <div className="flex flex-col items-center gap-3">
            <Skeleton className="h-24 w-full rounded-lg" />
        </div>
    )
}

export function ShopByBrandSection() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchBrands() {
            try {
                const fetchedBrands = await getBrands();
                setBrands(fetchedBrands);
            } catch (error) {
                console.error("Failed to fetch brands:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchBrands();
    }, []);

    if (isLoading) {
        return (
             <section className="bg-secondary/50 py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold font-headline">Shop by Brand</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => <BrandSkeleton key={i} />)}
                    </div>
                </div>
            </section>
        )
    }

    if (brands.length === 0) {
        return null; // Don't render the section if there are no brands
    }

    return (
        <section className="bg-secondary/50 py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold font-headline">
                        Shop by Brand
                    </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 items-center">
                    {brands.slice(0, 12).map((brand) => (
                        <Link key={brand.id} href={`/products?brand=${encodeURIComponent(brand.name)}`} className="group block">
                            <div className="bg-background p-4 rounded-lg flex items-center justify-center h-24 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                                <div className="relative w-full h-full">
                                    <Image 
                                        src={brand.logo}
                                        alt={brand.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
