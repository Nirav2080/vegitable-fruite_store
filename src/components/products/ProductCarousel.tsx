'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductCard } from '@/components/products/ProductCard'
import type { Product } from '@/lib/types'

interface ProductCarouselProps {
  products: Product[]
  autoplay?: boolean
  autoplayDelay?: number
  className?: string
}

export function ProductCarousel({
  products,
  autoplay = true,
  autoplayDelay = 4000,
  className,
}: ProductCarouselProps) {
  const plugins = autoplay
    ? [
        Autoplay({
          delay: autoplayDelay,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]
    : []

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      loop: false,
      skipSnaps: false,
      dragFree: false,
    },
    plugins
  )

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    setScrollSnaps(emblaApi.scrollSnapList())
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  if (!products || products.length === 0) return null

  return (
    <div className={cn('relative group/carousel', className)}>
      {/* Carousel viewport */}
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

      {/* Navigation arrows — glassmorphism style, centered vertically */}
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className={cn(
          'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20',
          'h-10 w-10 md:h-11 md:w-11 rounded-xl',
          'flex items-center justify-center',
          'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md',
          'border border-border/30',
          'shadow-sm shadow-black/[0.04]',
          'text-gray-700 dark:text-gray-200',
          'transition-all duration-300 ease-out',
          'hover:bg-primary hover:text-white hover:border-primary hover:shadow-md',
          'disabled:opacity-0 disabled:pointer-events-none',
          'opacity-0 group-hover/carousel:opacity-100',
          'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
        )}
        aria-label="Previous products"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        className={cn(
          'absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20',
          'h-10 w-10 md:h-11 md:w-11 rounded-xl',
          'flex items-center justify-center',
          'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md',
          'border border-border/30',
          'shadow-sm shadow-black/[0.04]',
          'text-gray-700 dark:text-gray-200',
          'transition-all duration-300 ease-out',
          'hover:bg-primary hover:text-white hover:border-primary hover:shadow-md',
          'disabled:opacity-0 disabled:pointer-events-none',
          'opacity-0 group-hover/carousel:opacity-100',
          'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
        )}
        aria-label="Next products"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

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
                  ? 'w-7 h-2.5 bg-primary shadow-sm shadow-black/[0.06]'
                  : 'w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              )}
              aria-label={`Go to slide group ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/** Inline nav buttons for placing in header rows */
export function CarouselNavButtons({
  onPrev,
  onNext,
  canScrollPrev,
  canScrollNext,
  className,
}: {
  onPrev: () => void
  onNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        onClick={onPrev}
        disabled={!canScrollPrev}
        className={cn(
          'h-9 w-9 md:h-10 md:w-10 rounded-xl',
          'flex items-center justify-center',
          'border border-border/30',
          'bg-white dark:bg-gray-900',
          'text-gray-600 dark:text-gray-300',
          'transition-all duration-200',
          'hover:bg-primary hover:text-white hover:border-primary hover:shadow-md',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-border/30 disabled:hover:shadow-none'
        )}
        aria-label="Previous"
      >
        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
      </button>
      <button
        onClick={onNext}
        disabled={!canScrollNext}
        className={cn(
          'h-9 w-9 md:h-10 md:w-10 rounded-xl',
          'flex items-center justify-center',
          'border border-border/30',
          'bg-white dark:bg-gray-900',
          'text-gray-600 dark:text-gray-300',
          'transition-all duration-200',
          'hover:bg-primary hover:text-white hover:border-primary hover:shadow-md',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-border/30 disabled:hover:shadow-none'
        )}
        aria-label="Next"
      >
        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
      </button>
    </div>
  )
}

/** Hook to get carousel API for external nav button control */
export function useProductCarousel(autoplay = true, autoplayDelay = 4000) {
  const plugins = autoplay
    ? [
        Autoplay({
          delay: autoplayDelay,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]
    : []

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      loop: false,
      skipSnaps: false,
      dragFree: false,
    },
    plugins
  )

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    setScrollSnaps(emblaApi.scrollSnapList())
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  return {
    emblaRef,
    emblaApi,
    canScrollPrev,
    canScrollNext,
    selectedIndex,
    scrollSnaps,
    scrollPrev,
    scrollNext,
    scrollTo,
  }
}
