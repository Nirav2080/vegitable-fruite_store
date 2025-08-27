
'use client'

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/products/ProductCard";
import { blogPosts, products } from "@/lib/data";
import { ArrowRight, Leaf, Package, Carrot } from "lucide-react";
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

const promoCards = [
  {
    title: 'The Ultimate Coffee',
    supertitle: 'CUBAN COFFEE',
    href: '/products',
    image: 'https://picsum.photos/seed/coffee-beans/400/250',
    hint: 'coffee beans',
    bgColor: 'bg-[#6F4E37]/90'
  },
  {
    title: 'A Grade Black Grapes',
    supertitle: 'SWEET AND ROBUST',
    href: '/products',
    image: 'https://picsum.photos/seed/black-grapes/400/250',
    hint: 'black grapes',
    bgColor: 'bg-[#3d3d5c]/90'
  },
  {
    title: 'Online Shopping For Meat',
    supertitle: 'THE RED MEAT',
    href: '/products',
    image: 'https://picsum.photos/seed/salmon-package/400/250',
    hint: 'packaged salmon',
    bgColor: 'bg-[#008080]/90'
  },
  {
    title: '100% Organic Mangoes',
    supertitle: 'BUY MANGOES',
    href: '/products',
    image: 'https://picsum.photos/seed/mangoes/400/250',
    hint: 'ripe mangoes',
    bgColor: 'bg-[#FFD700]/90 text-yellow-900'
  }
];

const categories = [
  { name: 'Fresh Fruits', href: '/products?category=Fruits', icon: <Leaf className="w-8 h-8 text-primary" />, description: 'The best seasonal fruits, locally sourced.' },
  { name: 'Crisp Vegetables', href: '/products?category=Vegetables', icon: <Carrot className="w-8 h-8 text-primary" />, description: 'A wide range of farm-fresh vegetables.' },
  { name: 'Organic Boxes', href: '/products?category=Organic+Boxes', icon: <Package className="w-8 h-8 text-primary" />, description: 'Curated boxes of mixed organic produce.' },
]

export default function Home() {
  const weeklySpecials = products.filter(p => p.isSeasonal).slice(0, 4);
  const featuredBlogs = blogPosts.slice(0, 3);
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
    <div className="flex flex-col gap-8 md:gap-12">
      <section className="w-full">
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
      </section>

      <section className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {promoCards.map((card, index) => (
            <Link href={card.href} key={index} className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
               <Image
                  src={card.image}
                  alt={card.title}
                  data-ai-hint={card.hint}
                  width={400}
                  height={250}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              <div className={`absolute inset-0 ${card.bgColor} flex flex-col justify-end p-4`}>
                <p className="text-xs font-bold uppercase text-white/80">{card.supertitle}</p>
                <h3 className="text-white text-lg font-bold font-headline">{card.title}</h3>
                <p className="mt-2 text-sm font-semibold text-white underline decoration-2 underline-offset-4 opacity-80 group-hover:opacity-100 transition-opacity">Shop Now</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      <section className="container mx-auto px-4 mt-8 md:mt-12">
        <h2 className="text-3xl font-bold text-center font-headline">Weekly Specials</h2>
        <p className="mt-2 text-center text-muted-foreground max-w-xl mx-auto">Check out this week's seasonal picks, offering the best value and freshness.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-8">
          {weeklySpecials.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link href="/products">View All Products <ArrowRight className="ml-2 h-4 w-4" /></Link>

          </Button>
        </div>
      </section>

      <section className="bg-muted py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center font-headline">From Our Blog</h2>
          <p className="mt-2 text-center text-muted-foreground max-w-xl mx-auto">Get inspired with our latest recipes, tips, and stories from the farm.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {featuredBlogs.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group">
                <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-56 w-full">
                    <Image src={post.imageUrl} alt={post.title} fill className="object-cover"/>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
                    <p className="text-sm text-muted-foreground pt-2">{post.date} &middot; {post.author}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <span className="font-semibold text-primary group-hover:underline">Read More <ArrowRight className="inline-block ml-1 h-4 w-4" /></span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild>
              <Link href="/blog">Visit Blog</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
