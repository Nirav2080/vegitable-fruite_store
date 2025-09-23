
'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { EmblaCarouselType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ProductCard } from '@/components/products/ProductCard'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Product } from '@/lib/types'
import Link from 'next/link'
import { Skeleton } from '../ui/skeleton'

function PopularProductsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
       <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-8 w-16" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  )
}

export function PopularProductsSection({ products }: { products: Product[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay()])
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [currentSnap, setCurrentSnap] = useState(0)


  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setCurrentSnap(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    setScrollSnaps(emblaApi.scrollSnaps())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])
  
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold font-headline">Popular Food Items</h2>
         <Button variant="link" asChild>
            <Link href="/products?sort=popularity">
                See All
            </Link>
        </Button>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 pl-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-8">
        <div className="text-sm text-muted-foreground">
          <span className="font-bold">{String(currentSnap + 1).padStart(2, '0')}</span>
          <span className="mx-1">/</span>
          <span>{String(scrollSnaps.length).padStart(2, '0')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={scrollPrev} className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="default" size="icon" onClick={scrollNext} className="rounded-full">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
