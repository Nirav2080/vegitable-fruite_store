
'use client'

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { getActiveBanners } from '@/lib/cached-data'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Banner } from '@/lib/types'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

export function HeroCarousel() {
    const [banners, setBanners] = React.useState<Banner[]>([])
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })])

    React.useEffect(() => {
        const fetchBanners = async () => {
            try {
                const activeBanners = await getActiveBanners();
                setBanners(activeBanners);
            } catch (error) {
                console.error("Failed to fetch banners", error);
            }
        };
        fetchBanners();
    }, []);

    const scrollPrev = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    if (banners.length === 0) {
        return (
            <section className="bg-accent">
                <div className="container mx-auto px-4 grid md:grid-cols-2 items-center gap-8">
                    <div className="py-12 md:py-24 text-center md:text-left">
                        <p className="text-primary font-semibold tracking-wider">AOTEAROA ORGANICS</p>
                        <h1 className="text-4xl md:text-6xl font-bold font-headline mt-2">
                           Naturally Fresh, Locally Sourced
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
                           Experience the taste of Aotearoa with our range of fresh, organic produce delivered right to your door.
                        </p>
                        <Button asChild size="lg" className="mt-8 rounded-full">
                          <Link href="/products">
                            <ArrowRight className="mr-2 h-5 w-5" />
                            Shop Now
                          </Link>
                        </Button>
                    </div>
                     <div className="relative h-[300px] md:h-[500px]">
                         <Image
                            src="https://picsum.photos/seed/groceries/600/600"
                            alt="Woman holding a bag of fresh groceries"
                            data-ai-hint="fresh groceries"
                            fill
                            className="relative z-10 w-full h-full object-contain"
                        />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <div className="relative" ref={emblaRef}>
            <div className="flex">
                {banners.map((banner) => (
                    <div key={banner.id} className="flex-[0_0_100%] relative h-[400px] md:h-[500px] lg:h-[600px]">
                        <Image
                            src={banner.image}
                            alt={banner.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="container mx-auto px-4 text-center text-white">
                                <p className="font-semibold tracking-widest uppercase">{banner.supertitle}</p>
                                <h1 className="text-4xl md:text-6xl font-bold font-headline mt-2">{banner.title}</h1>
                                <p className="mt-4 text-lg max-w-2xl mx-auto">{banner.subtitle}</p>
                                <Button asChild size="lg" className="mt-8 rounded-full">
                                    <Link href={banner.href}>
                                        <ArrowRight className="mr-2 h-5 w-5" />
                                        Shop Now
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 text-black hover:bg-white"
                onClick={scrollPrev}
            >
                <ChevronLeft />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 text-black hover:bg-white"
                onClick={scrollNext}
            >
                <ChevronRight />
            </Button>
        </div>
    )
}
