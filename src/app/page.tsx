

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/products/ProductCard";
import { ArrowRight, Leaf, Package, Carrot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { getProducts } from "@/lib/actions/products";
import { HeroCarousel } from "@/components/layout/HeroCarousel";


const promoCards = [
  {
    title: 'The Ultimate Coffee',
    supertitle: 'CUBAN COFFEE',
    href: '/products',
    image: 'https://placehold.co/400x250/6F4E37/FFFFFF',
    hint: 'coffee beans',
    bgColor: 'bg-[#6F4E37]/90'
  },
  {
    title: 'A Grade Black Grapes',
    supertitle: 'SWEET AND ROBUST',
    href: '/products',
    image: 'https://placehold.co/400x250/3d3d5c/FFFFFF',
    hint: 'black grapes',
    bgColor: 'bg-[#3d3d5c]/90'
  },
  {
    title: 'Online Shopping For Meat',
    supertitle: 'THE RED MEAT',
    href: '/products',
    image: 'https://placehold.co/400x250/008080/FFFFFF',
    hint: 'packaged salmon',
    bgColor: 'bg-[#008080]/90'
  },
  {
    title: '100% Organic Mangoes',
    supertitle: 'BUY MANGOES',
    href: '/products',
    image: 'https://placehold.co/400x250/FFD700/000000',
    hint: 'ripe mangoes',
    bgColor: 'bg-[#FFD700]/90 text-yellow-900'
  }
];

const categories = [
  { name: 'Fresh Fruits', href: '/products?category=Fruits', icon: <Leaf className="w-8 h-8 text-primary" />, description: 'The best seasonal fruits, locally sourced.' },
  { name: 'Crisp Vegetables', href: '/products?category=Vegetables', icon: <Carrot className="w-8 h-8 text-primary" />, description: 'A wide range of farm-fresh vegetables.' },
  { name: 'Organic Boxes', href: '/products?category=Organic+Boxes', icon: <Package className="w-8 h-8 text-primary" />, description: 'Curated boxes of mixed organic produce.' },
]

export default async function Home() {
  const allProducts = await getProducts();
  const weeklySpecials = allProducts.filter(p => p.isSeasonal).slice(0, 4);
  
  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <section className="w-full">
         <HeroCarousel />
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

    </div>
  );
}
