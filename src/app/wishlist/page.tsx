
'use client'

import { useWishlist } from '@/hooks/use-wishlist'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Heart, Trash2, ImageIcon } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import type { Product } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleMoveToCart = (product: Product) => {
    // Ensure product and its variants are valid before proceeding
    if (!product || !Array.isArray(product.variants) || product.variants.length === 0) {
        toast({
            title: "Cannot move to cart",
            description: "This product is currently unavailable or has no options.",
            variant: "destructive",
        });
        return;
    }
    const defaultVariant = product.variants[0];
    addToCart(product, 1, defaultVariant);
    removeFromWishlist(product.id);
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/50">
            <Heart className="h-7 w-7 text-muted-foreground" />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">Your Wishlist is Empty</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Looks like you haven&apos;t added anything to your wishlist yet.</p>
          <Button asChild className="mt-8 rounded-xl px-8 shadow-sm">
            <Link href="/products">Explore Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:py-16 lg:px-8">
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-2">Saved Items</p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Your Wishlist</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your favourite items, all in one place.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => {
          // Safeguard against items without variants
          if (!item.variants || item.variants.length === 0) return null;
          const defaultVariant = item.variants[0];
          
          return (
            <div key={item.id} className="border border-border/30 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:shadow-black/[0.04] hover:border-border/50">
              <div>
                <div className="relative h-40 w-full rounded-xl overflow-hidden mb-4 bg-secondary/40">
                    {Array.isArray(item.images) && item.images.length > 0 ? (
                        <Image
                            src={item.images[0]}
                            alt={item.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                    )}
                </div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="font-bold text-primary mt-1">${defaultVariant.price.toFixed(2)}</p>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                  <Button onClick={() => handleMoveToCart(item)} className="rounded-xl shadow-sm">Move to Cart</Button>
                  <Button variant="outline" size="icon" className="self-end rounded-xl" onClick={() => removeFromWishlist(item.id)}>
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
