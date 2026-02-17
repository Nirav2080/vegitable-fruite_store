
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
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-emerald-50">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight font-headline">Your Wishlist is Empty</h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">Looks like you haven&apos;t added anything to your wishlist yet.</p>
          <Button asChild className="mt-8 rounded-full px-8 shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30">
            <Link href="/products">Explore Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 md:py-12 lg:px-8">
      <header className="text-center mb-10">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          Saved Items
        </span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight font-headline sm:text-4xl">Your Wishlist</h1>
        <p className="mt-2 text-muted-foreground">Your favorite items, all in one place.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => {
          // Safeguard against items without variants
          if (!item.variants || item.variants.length === 0) return null;
          const defaultVariant = item.variants[0];
          
          return (
            <div key={item.id} className="border border-border/60 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
              <div>
                <div className="relative h-40 w-full rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-green-50/80 to-emerald-50/40">
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
                  <Button onClick={() => handleMoveToCart(item)} className="rounded-full shadow-md shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30">Move to Cart</Button>
                  <Button variant="outline" size="icon" className="self-end rounded-full" onClick={() => removeFromWishlist(item.id)}>
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
