
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
          // Safeguard against items without variants
          if (!item.variants || item.variants.length === 0) return null;
          const defaultVariant = item.variants[0];
          
          return (
            <div key={item.id} className="border rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="relative h-40 w-full rounded-md overflow-hidden mb-4 bg-muted">
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
