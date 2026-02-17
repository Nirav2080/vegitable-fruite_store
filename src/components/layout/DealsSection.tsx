
"use client"

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "../products/ProductCard";
import { CarouselNavButtons, useProductCarousel } from "@/components/products/ProductCarousel";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DealsSectionProps {
    products: Product[];
}

export function DealsSection({ products }: DealsSectionProps) {
    const {
        emblaRef,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        scrollSnaps,
        scrollPrev,
        scrollNext,
        scrollTo,
    } = useProductCarousel(true, 3500);

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className="w-full overflow-hidden bg-gradient-to-br from-green-50/60 via-emerald-50/40 to-teal-50/30 dark:from-green-950/20 dark:via-emerald-950/10 dark:to-teal-950/5">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8">
                {/* Header row: title + nav buttons + view all */}
                <div className="flex items-end justify-between mb-8 gap-4">
                    <div className="min-w-0">
                        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-orange-300/40 bg-orange-100/60 dark:bg-orange-900/20 dark:border-orange-700/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                            Hot Deals
                        </span>
                        <h2 className="mt-2 text-2xl font-extrabold tracking-tight font-headline sm:text-3xl md:text-4xl">
                            Today&apos;s Deals
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <CarouselNavButtons
                            onPrev={scrollPrev}
                            onNext={scrollNext}
                            canScrollPrev={canScrollPrev}
                            canScrollNext={canScrollNext}
                        />
                        <Button asChild variant="outline" className="hidden sm:inline-flex rounded-full border-primary/20 text-primary transition-all duration-200 hover:bg-primary/5 hover:shadow-sm">
                            <Link href="/products?filter=isDeal">
                                View All <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Carousel */}
                <div className="relative">
                    <div ref={emblaRef} className="overflow-hidden rounded-xl">
                        <div className="flex -ml-3 md:-ml-4">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="min-w-0 shrink-0 grow-0 pl-3 md:pl-4 basis-full sm:basis-[48%] md:basis-[32%] lg:basis-[25%]"
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dot indicators */}
                {scrollSnaps.length > 1 && (
                    <div className="flex items-center justify-center gap-1.5 mt-6">
                        {scrollSnaps.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollTo(index)}
                                className={cn(
                                    'rounded-full transition-all duration-300 ease-out',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                                    index === selectedIndex
                                        ? 'w-7 h-2.5 bg-primary shadow-sm shadow-primary/30'
                                        : 'w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                                )}
                                aria-label={`Go to slide group ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Mobile "View All" button */}
                <div className="mt-6 sm:hidden text-center">
                    <Button asChild variant="outline" className="rounded-full border-primary/20 text-primary">
                        <Link href="/products?filter=isDeal">
                            View All Deals <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
