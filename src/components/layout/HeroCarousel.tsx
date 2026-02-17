
'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Banner } from '@/lib/types'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeroCarouselProps {
  banners: Banner[]
}

/* ── Empty / fallback state ─────────────────────────────── */
function HeroFallback() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50/80 to-teal-50">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-teal-100/40 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[420px] items-center gap-8 py-12 sm:min-h-[460px] sm:py-16 md:min-h-[500px] lg:grid-cols-2 lg:gap-12 lg:py-20">
          {/* Text content — centered on mobile, left-aligned on lg */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              Fresh &amp; Organic
            </span>

            <h1 className="max-w-xl text-3xl font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[3.5rem] font-headline">
              Farm Fresh Fruits &amp; Vegetables{' '}
              <span className="text-primary">Delivered Fast</span>
            </h1>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg">
              Experience the taste of Aotearoa with our range of fresh, organic produce delivered right to your door.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
              <Button asChild size="lg" className="w-full rounded-full px-8 text-base shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 sm:w-auto">
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full rounded-full px-8 text-base sm:w-auto">
                <Link href="/products">
                  Browse Categories
                </Link>
              </Button>
            </div>

            {/* Trust signals */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground sm:mt-10 lg:justify-start">
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                100% Fresh Guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Free Delivery $50+
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Same Day Dispatch
              </span>
            </div>
          </div>

          {/* Right — decorative produce grid (lg only) */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4 pt-8">
                <div className="h-40 w-40 overflow-hidden rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg xl:h-48 xl:w-48">
                  <div className="flex h-full w-full items-center justify-center text-6xl xl:text-7xl">🥬</div>
                </div>
                <div className="h-40 w-40 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-amber-100 shadow-lg xl:h-48 xl:w-48">
                  <div className="flex h-full w-full items-center justify-center text-6xl xl:text-7xl">🥕</div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="h-40 w-40 overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 to-rose-100 shadow-lg xl:h-48 xl:w-48">
                  <div className="flex h-full w-full items-center justify-center text-6xl xl:text-7xl">🍎</div>
                </div>
                <div className="h-40 w-40 overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-50 to-lime-100 shadow-lg xl:h-48 xl:w-48">
                  <div className="flex h-full w-full items-center justify-center text-6xl xl:text-7xl">🍋</div>
                </div>
              </div>
              {/* Floating accent circle */}
              <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-primary/10 xl:h-20 xl:w-20" />
              <div className="absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-amber-200/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Dot indicators ─────────────────────────────────────── */
function DotIndicators({
  count,
  active,
  onSelect,
}: {
  count: number
  active: number
  onSelect: (i: number) => void
}) {
  return (
    <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-7">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onSelect(i)}
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            i === active ? 'w-7 bg-white' : 'w-2 bg-white/50 hover:bg-white/75',
          )}
        />
      ))}
    </div>
  )
}

/* ── Main carousel ──────────────────────────────────────── */
export function HeroCarousel({ banners }: HeroCarouselProps) {
  const hasMultiple = banners.length > 1

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: hasMultiple, duration: 30 },
    hasMultiple ? [Autoplay({ delay: 5000, stopOnInteraction: false })] : [],
  )

  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    onSelect()
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi])

  /* Fallback when no banners */
  if (!banners || banners.length === 0) return <HeroFallback />

  return (
    <section className="relative w-full overflow-hidden bg-black">
      {/* Embla viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex touch-pan-y">
          {banners.map((banner, index) => (
            <article
              key={banner.id}
              className="relative min-w-0 flex-[0_0_100%]"
            >
              {/* Background image */}
              <div className="relative h-[50vh] min-h-[360px] sm:h-[55vh] sm:min-h-[420px] md:h-[60vh] md:min-h-[480px] lg:h-[70vh] lg:min-h-[560px]">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={index === 0}
                  quality={85}
                />

                {/* Gradient overlay — stronger at bottom & left for text readability */}
                <div
                  className="absolute inset-0"
                  aria-hidden="true"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(0,0,0,.65) 0%, rgba(0,0,0,.35) 50%, rgba(0,0,0,.15) 100%), linear-gradient(to top, rgba(0,0,0,.5) 0%, transparent 60%)',
                  }}
                />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
                    <div className="flex flex-col items-center text-center md:items-start md:text-left md:max-w-2xl lg:max-w-3xl">
                      {/* Supertitle badge */}
                      {banner.supertitle && (
                        <span className="mb-3 inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm sm:text-xs">
                          {banner.supertitle}
                        </span>
                      )}

                      {/* Title */}
                      <h1 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl font-headline drop-shadow-md">
                        {banner.title}
                      </h1>

                      {/* Subtitle */}
                      {banner.subtitle && (
                        <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base md:text-lg lg:max-w-xl">
                          {banner.subtitle}
                        </p>
                      )}

                      {/* CTA */}
                      <Button
                        asChild
                        size="lg"
                        className="mt-7 rounded-full px-8 text-sm font-semibold shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/40 sm:mt-8 sm:w-auto sm:text-base"
                      >
                        <Link href={banner.href}>
                          Shop Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Navigation arrows — hidden on mobile, visible md+ */}
      {hasMultiple && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={scrollPrev}
            className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/50 md:flex lg:left-5 lg:p-3"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={scrollNext}
            className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/50 md:flex lg:right-5 lg:p-3"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {hasMultiple && (
        <DotIndicators
          count={banners.length}
          active={selectedIndex}
          onSelect={scrollTo}
        />
      )}
    </section>
  )
}
