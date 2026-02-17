
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
             <section className="bg-gradient-to-br from-green-50/60 via-emerald-50/40 to-teal-50/30 py-16 sm:py-20 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold tracking-tight font-headline">Shop by Brand</h2>
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
        <section className="bg-gradient-to-br from-green-50/60 via-emerald-50/40 to-teal-50/30 py-16 sm:py-20 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                        Brands
                    </span>
                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight font-headline md:text-4xl">
                        Shop by Brand
                    </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 items-center">
                    {brands.slice(0, 12).map((brand) => (
                        <Link key={brand.id} href={`/products?brand=${encodeURIComponent(brand.name)}`} className="group block">
                            <div className="bg-background p-5 rounded-2xl border border-border/60 flex items-center justify-center h-24 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/5 group-hover:scale-105 group-hover:border-primary/20">
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
