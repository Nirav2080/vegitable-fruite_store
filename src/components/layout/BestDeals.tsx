
'use client'

import React, { useState, useEffect } from 'react';
import { getProducts } from '@/lib/actions/products';
import type { Product } from '@/lib/types';
import { ProductCard } from '../products/ProductCard';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { CountdownTimer } from './CountdownTimer';
import { Skeleton } from '../ui/skeleton';

function BestDealsSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="border rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 h-full">
                <Skeleton className="w-full md:w-1/2 h-64 rounded-md" />
                <div className="w-full md:w-1/2 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <div className="flex gap-2">
                        <Skeleton className="h-16 w-16 rounded-md" />
                        <Skeleton className="h-16 w-16 rounded-md" />
                        <Skeleton className="h-16 w-16 rounded-md" />
                    </div>
                     <Skeleton className="h-10 w-full" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
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
        return null; // Or render a placeholder
    }

    const mainDeal = dealProducts[0];
    const otherDeals = dealProducts.slice(1, 5);
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3); // Set timer for 3 days from now

    return (
        <div>
            <h2 className="text-2xl font-bold font-headline relative mb-6 pb-2">
                Best Deals of the Week
                <div className="absolute bottom-0 left-0 w-20 h-1 bg-primary"></div>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                 <div className="border rounded-lg p-4 sm:p-6 flex flex-col md:flex-row items-center gap-6 h-full hover:shadow-lg transition-shadow duration-300">
                    <Link href={`/products/${mainDeal.slug}`} className="w-full md:w-1/2 flex-shrink-0">
                         <div className="relative aspect-square rounded-md overflow-hidden">
                            <Image 
                                src={mainDeal.images[0]}
                                alt={mainDeal.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </Link>
                    <div className="flex flex-col items-start h-full flex-1">
                        <h3 className="text-xl font-semibold leading-tight">
                            <Link href={`/products/${mainDeal.slug}`} className="hover:text-primary transition-colors">
                                {mainDeal.name}
                            </Link>
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                            <p className="text-2xl font-bold text-primary">${mainDeal.variants[0].price.toFixed(2)}</p>
                            {mainDeal.variants[0].originalPrice && <p className="text-lg text-muted-foreground line-through">${mainDeal.variants[0].originalPrice.toFixed(2)}</p>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{mainDeal.description.substring(0, 100)}...</p>
                        
                        <div className='my-4 flex-grow'>
                            <p className='text-sm font-medium mb-2'>Hurry up! Offer ends in:</p>
                            <CountdownTimer targetDate={targetDate.toISOString()} />
                        </div>

                        <Button asChild className="w-full mt-auto">
                           <Link href={`/products/${mainDeal.slug}`}>View Deal</Link>
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    {otherDeals.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    )
}
