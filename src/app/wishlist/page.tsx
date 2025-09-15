
'use client'

import { useWishlist } from '@/hooks/use-wishlist'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Heart, Trash2 } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import type { Product } from '@/lib/types'

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart();

  const handleMoveToCart = (product: Product) => {
    const defaultVariant = product.variants?.[0];
    if (defaultVariant) {
        addToCart(product, 1, defaultVariant);
        removeFromWishlist(product.id);
    } else {
        // Handle case where product has no variants, maybe show a toast
        console.error("Product has no variants to add to cart.");
    }
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Heart className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="mt-6 text-3xl font-bold font-headline">Your Wishlist is Empty</h1>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your wishlist yet.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Explore Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Your Wishlist</h1>
        <p className="mt-2 text-muted-foreground">Your favorite items, all in one place.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => {
          const defaultVariant = item.variants?.[0];
          if (!defaultVariant) return null;

          return (
            <div key={item.id} className="border rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="relative h-40 w-full rounded-md overflow-hidden mb-4">
                  <Image
                    src={Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : 'https://placehold.co/150x150/EEE/31343C'}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="font-bold text-primary mt-1">${defaultVariant.price.toFixed(2)}</p>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                  <Button onClick={() => handleMoveToCart(item)}>Move to Cart</Button>
                  <Button variant="outline" size="icon" className="self-end" onClick={() => removeFromWishlist(item.id)}>
                      <Trash2 className="h-4 w-4" />
                  </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
