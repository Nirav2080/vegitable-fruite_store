
'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Loader2, ShoppingCart } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { createCheckoutSession } from '@/lib/actions/stripe'
import { getStripe } from '@/lib/stripe'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import Image from 'next/image'

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount } = useCart()
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
        const { sessionId } = await createCheckoutSession(cartItems);
        const stripe = await getStripe();
        
        if (!stripe) {
            throw new Error("Stripe.js has not loaded yet.");
        }

        const { error } = await stripe.redirectToCheckout({ sessionId });
        
        if (error) {
            console.error(error.message);
            toast({
                title: 'Error',
                description: 'Failed to redirect to Stripe. Please try again.',
                variant: 'destructive',
            });
        }
    } catch (error: any) {
        console.error("Checkout error:", error);
        toast({
            title: 'Error',
            description: error.message || 'Something went wrong. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  }
  
  if (cartCount === 0 && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="mt-6 text-3xl font-bold font-headline">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">You need to add items to your cart before you can check out.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Checkout</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
            <h2 className="text-2xl font-bold font-headline mb-4">Order Summary</h2>
            <div className='space-y-4'>
            {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                        <Image
                            src={Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : 'https://placehold.co/100x100/EEE/31343C'}
                            alt={item.name}
                            fill
                            className="object-contain"
                        />
                         <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {item.quantity}
                        </span>
                    </div>
                    <div className="flex-grow">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.selectedVariant.weight}</p>
                    </div>
                    <p className="font-semibold">${(item.selectedVariant.price * item.quantity).toFixed(2)}</p>
                </div>
            ))}
            </div>
            <Separator className="my-6" />
            <div className="space-y-2">
                <div className="flex justify-between">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p className="font-semibold">${cartTotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-muted-foreground">Shipping</p>
                    <p className="font-semibold">Free</p>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                    <p>Total</p>
                    <p>${cartTotal.toFixed(2)}</p>
                </div>
            </div>
        </div>
        <div>
            <h2 className="text-2xl font-bold font-headline mb-4">Payment</h2>
            <div className="border rounded-lg p-6 bg-muted/20">
                <p className="text-muted-foreground">You will be redirected to our secure payment partner, Stripe, to complete your purchase.</p>
                 <Button onClick={handleCheckout} disabled={isLoading || cartCount === 0} size="lg" className="w-full mt-6">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        'Proceed to Payment'
                    )}
                </Button>
            </div>
        </div>
      </div>
    </div>
  )
}
