
'use client'

import { useCart } from '@/hooks/use-cart'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart()

  if (cartCount === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="mt-6 text-3xl font-bold font-headline">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Your Shopping Cart</h1>
        <p className="mt-2 text-muted-foreground">Review your items.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <div className="space-y-4">
                {cartItems.map((item) => {
                  // Safeguard against items without a selectedVariant
                  if (!item.selectedVariant) {
                    return null; 
                  }
                  return (
                    <div key={item.id} className="grid grid-cols-[auto,1fr,auto] md:grid-cols-[auto,1fr,auto,auto] items-center gap-4 p-4 border rounded-lg">
                        <div className="relative h-16 w-16 md:h-24 md:w-24 rounded-md overflow-hidden">
                            <Image
                                src={Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : 'https://placehold.co/100x100/EEE/31343C'}
                                alt={item.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-sm md:text-base">{item.name}</h3>
                            <p className="text-xs md:text-sm text-muted-foreground">Unit: {item.selectedVariant.weight}</p>
                            <p className="font-bold text-primary mt-1 text-sm md:text-base">${item.selectedVariant.price.toFixed(2)}</p>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-2">
                             <div className="flex items-center border rounded-md">
                                <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeFromCart(item.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                         <div className="w-20 text-right font-semibold hidden md:block">
                            ${(item.selectedVariant.price * item.quantity).toFixed(2)}
                        </div>
                    </div>
                  )
                })}
            </div>
        </div>
        <aside className="lg:col-span-1">
            <div className="sticky top-24 border rounded-lg p-6">
                <h2 className="text-xl font-bold font-headline mb-4">Order Summary</h2>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal ({cartCount} items)</span>
                        <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-semibold">Free</span>
                    </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                </div>
                 <Button asChild size="lg" className="w-full mt-6">
                    <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button asChild size="lg" className="w-full mt-2" variant="outline">
                    <Link href="/products">Continue Shopping</Link>
                </Button>
            </div>
        </aside>
      </div>

    </div>
  )
}
