
'use client'

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"

const heroSlides = [
  {
    supertitle: "SALE UP TO 30% OFF",
    title: "Shop Badam Milk & Badam Drink",
    subtitle: "The Real Taste And Boost Your Day With The Power",
    image: "https://picsum.photos/seed/badam-milk/1200/600",
    hint: "almond milk",
    href: "/products",
  },
  {
    supertitle: "FRESH & ORGANIC",
    title: "Naturally Fresh, Locally Sourced",
    subtitle: "Experience the taste of Aotearoa with our premium selection of organic fruits and vegetables.",
    image: "https://picsum.photos/1800/1200",
    hint: "fresh produce",
    href: "/products",
  },
   {
    supertitle: "SEASON'S BEST",
    title: "Crisp, Sweet Apples",
    subtitle: "Straight from local orchards, bursting with flavor.",
    image: "https://picsum.photos/seed/apples-orchard/1200/600",
    hint: "apple orchard",
    href: "/products?category=Fruits",
  },
];


export function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
 
  React.useEffect(() => {
    if (!api) {
      return
    }
 
    setCurrent(api.selectedScrollSnap())
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

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
                data-ai-hint={slide.hint}
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
