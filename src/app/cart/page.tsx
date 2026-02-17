'use client'

import { useCart } from '@/hooks/use-cart'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, cartTotal, cartCount, applyDiscount, couponCode, discountAmount, totalSavings, originalSubtotal, savingsFromSales } = useCart()
  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async () => {
      if (!couponInput) return;
      setIsApplying(true);
      await applyDiscount(couponInput);
      setIsApplying(false);
  }

  if (cartCount === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-md">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-emerald-50">
            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight font-headline">Your Cart is Empty</h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Button asChild className="mt-8 rounded-full px-8 shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30">
            <Link href="/products">Start Shopping</Link>
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
          Shopping Cart
        </span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight font-headline sm:text-4xl">Your Shopping Cart</h1>
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
                    <div key={item.id} className="grid grid-cols-[auto,1fr,auto] md:grid-cols-[auto,1fr,auto,auto] items-center gap-4 p-4 border border-border/60 rounded-2xl transition-all duration-200 hover:shadow-sm hover:border-primary/10">
                        <div className="relative h-16 w-16 md:h-24 md:w-24 rounded-md overflow-hidden bg-muted">
                            {Array.isArray(item.images) && item.images.length > 0 ? (
                                <Image
                                    src={item.images[0]}
                                    alt={item.name}
                                    fill
                                    className="object-contain"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                    <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-sm md:text-base">{item.name}</h3>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              {item.unitType === 'weight' ? 'Weight' : 'Unit'}: {item.selectedVariant.weight}
                            </p>
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
            <div className="sticky top-24 border border-border/60 rounded-2xl p-6 bg-gradient-to-br from-green-50/30 to-emerald-50/20">
                <h2 className="text-xl font-extrabold tracking-tight font-headline mb-4">Order Summary</h2>

                 {!couponCode ? (
                    <div className="flex gap-2 mb-4">
                        <Input 
                            placeholder="Discount code" 
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                        />
                        <Button onClick={handleApplyCoupon} disabled={!couponInput || isApplying}>
                            {isApplying ? 'Applying...' : 'Apply'}
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-between items-center p-2 bg-muted rounded-md mb-4">
                        <p className="text-sm font-semibold">Code Applied: <span className="font-bold text-primary">{couponCode}</span></p>
                        <Button variant="ghost" size="sm" onClick={() => applyDiscount('')}>Remove</Button>
                    </div>
                )}
                <Separator className="my-4" />

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">${originalSubtotal.toFixed(2)}</span>
                    </div>
                    {savingsFromSales > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Product Discounts</span>
                            <span>- ${savingsFromSales.toFixed(2)}</span>
                        </div>
                    )}
                     {discountAmount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Coupon ({couponCode})</span>
                            <span>- ${discountAmount.toFixed(2)}</span>
                        </div>
                    )}
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
                 <Button asChild size="lg" className="w-full mt-6 rounded-full shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-primary/30">
                    <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button asChild size="lg" className="w-full mt-2 rounded-full" variant="outline">
                    <Link href="/products">Continue Shopping</Link>
                </Button>
            </div>
        </aside>
      </div>

    </div>
  )
}
