

'use client'

import React, { useState, useEffect } from 'react';
import { getProducts } from '@/lib/actions/products';
import type { Product } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { DealProductCard } from './DealProductCard';

function BestDealsSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 flex gap-4">
                        <Skeleton className="w-1/3 h-auto" />
                        <div className="w-2/3 space-y-3">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-2 w-full" />
                            <div className="flex gap-2">
                                <Skeleton className="h-12 w-10" />
                                <Skeleton className="h-12 w-10" />
                                <Skeleton className="h-12 w-10" />
                                <Skeleton className="h-12 w-10" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}


export function BestDeals() {
    const [dealProducts, setDealProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDealProducts = async () => {
            setIsLoading(true);
            const allProducts = await getProducts();
            const deals = allProducts
                .filter(p => p.variants.some(v => v.originalPrice && v.originalPrice > v.price))
                .sort((a, b) => {
                    const discountA = a.variants[0].originalPrice! - a.variants[0].price;
                    const discountB = b.variants[0].originalPrice! - b.variants[0].price;
                    return discountB - discountA;
                });
            setDealProducts(deals);
            setIsLoading(false);
        };
        fetchDealProducts();
    }, []);

    if (isLoading) {
        return <BestDealsSkeleton />
    }
    
    if (dealProducts.length === 0) {
        return null; 
    }
    
    return (
        <div>
            <h2 className="text-2xl font-bold font-headline relative mb-6 pb-2">
                Deals of the week
                <div className="absolute bottom-0 left-0 w-20 h-1 bg-primary"></div>
            </h2>
            <Carousel 
                opts={{ align: "start", loop: true }}
                className="w-full relative"
            >
                <CarouselContent className="-ml-4">
                    {dealProducts.map((product, index) => (
                    <CarouselItem key={index} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                        <DealProductCard product={product} />
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 hidden lg:flex bg-white shadow-md w-10 h-10" />
                <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 hidden lg:flex bg-white shadow-md w-10 h-10" />
            </Carousel>
        </div>
    )
}
