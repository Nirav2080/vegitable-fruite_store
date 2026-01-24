
'use client'

import React from 'react'
import { ProductCard } from '@/components/products/ProductCard'
import type { Product } from '@/lib/types'
import Link from 'next/link'
import { Button } from '../ui/button'

interface PopularProductsSectionProps {
  products: Product[];
  title: string;
  link: string;
}

export function PopularProductsSection({ products, title, link }: PopularProductsSectionProps) {
  
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold font-headline">{title}</h2>
         <Button variant="link" asChild>
            <Link href={link}>
                See All
            </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
    </section>
  )
}
