
'use client'

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import type { Banner } from "@/lib/types";
import { getActiveBanners } from "@/lib/actions/banners";
import { Loader2 } from "lucide-react";

function HeroCarouselSkeleton() {
    return (
      <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] w-full flex items-center justify-center bg-muted">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
}


export function HeroCarousel() {
  const [heroSlides, setHeroSlides] = React.useState<Banner[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    async function fetchBanners() {
      setIsLoading(true);
      try {
        const banners = await getActiveBanners();
        setHeroSlides(banners);
      } catch (error) {
        console.error("Failed to fetch banners", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBanners();
  }, [])
 
  React.useEffect(() => {
    if (!api) {
      return
    }
 
    setCurrent(api.selectedScrollSnap())
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  if (isLoading) {
    return <HeroCarouselSkeleton />
  }

  if (heroSlides.length === 0) {
    return (
       <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] w-full bg-muted flex items-center justify-center">
        <div className="text-center">
            <h2 className="text-2xl font-semibold">No active banners</h2>
            <p className="text-muted-foreground">Add some banners in the admin dashboard to see them here.</p>
        </div>
       </div>
    )
  }

  return (
    <Carousel 
      setApi={setApi}
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      className="w-full"
      opts={{loop: true}}
    >
      <CarouselContent>
        {heroSlides.map((slide, index) => (
          <CarouselItem key={index}>
            <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] w-full">
              <Image
                src={slide.image}
                alt={slide.title}
                data-ai-hint="hero banner image"
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
              <div className="relative z-10 flex flex-col items-start justify-center h-full text-left text-white p-8 md:p-16 lg:p-24 max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-widest text-orange-300">{slide.supertitle}</p>
                <h1 className="text-4xl md:text-6xl font-headline font-bold drop-shadow-lg mt-2">
                  {slide.title}
                </h1>
                <p className="mt-4 text-lg md:text-xl max-w-xl drop-shadow-md">
                  {slide.subtitle}
                </p>
                <Button asChild size="lg" className="mt-8 bg-white hover:bg-gray-200 text-black font-bold">
                  <Link href={slide.href}>Shop Now</Link>
                </Button>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 w-2 rounded-full transition-all ${current === index ? 'w-4 bg-green-500' : 'bg-white'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </Carousel>
  )
}
