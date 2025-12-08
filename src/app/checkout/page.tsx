
'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Loader2, ShoppingCart, Lock } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { createCheckoutSession } from '@/lib/actions/stripe'
import { getStripe } from '@/lib/stripe'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import Image from 'next/image'
import type { User } from '@/lib/types'
import { getCurrentUser } from '@/lib/actions/users'
import { CheckoutProgress } from './_components/CheckoutProgress'
import { CheckoutAuth } from './_components/CheckoutAuth'
import { UserDetailsForm } from './_components/UserDetailsForm'


export default function CheckoutPage() {
    const { cartItems, cartTotal, cartCount } = useCart()
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isFormValid, setIsFormValid] = useState(false);
    const { toast } = useToast();
    
    useEffect(() => {
        const checkUser = async () => {
            setIsCheckingAuth(true);
            const loggedIn = localStorage.getItem('isCustomerLoggedIn') === 'true';
            const userDataString = localStorage.getItem('currentUser');
            if (loggedIn && userDataString) {
                const userData = JSON.parse(userDataString);
                try {
                    const fullUser = await getCurrentUser(userData.id);
                    setUser(fullUser);
                    if (fullUser?.address) {
                        setIsFormValid(true);
                    }
                } catch(e) {
                    console.error("failed to fetch user", e);
                }
            }
            setIsCheckingAuth(false);
        };
        
        const handleLoginStateChange = () => {
          checkUser();
        };

        checkUser();
        window.addEventListener('loginStateChange', handleLoginStateChange);
        return () => {
            window.removeEventListener('loginStateChange', handleLoginStateChange);
        };

    }, []);

    const handleCheckout = async () => {
        if (!user) {
            toast({
                title: 'Please log in',
                description: 'You must be logged in to place an order.',
                variant: 'destructive',
            });
            return;
        }

        if (!isFormValid) {
            toast({
                title: 'Shipping Information Required',
                description: 'Please fill out and save your shipping details.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);
        try {
            const stripe = await getStripe();

            if (!stripe) {
                throw new Error("Stripe.js has not loaded yet.");
            }

            const { sessionId } = await createCheckoutSession(cartItems);

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

    if (isCheckingAuth) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                 <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" />
            </div>
        )
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
      <div className="bg-muted/30">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            <CheckoutProgress currentStep={2} />
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-8">
                {user ? <UserDetailsForm user={user} onFormValidityChange={setIsFormValid} /> : <CheckoutAuth />}

                <div className="rounded-lg border bg-background p-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                   <div className="border rounded-md p-4">
                     <p className="text-sm">You will be redirected to our secure payment partner, Stripe, to complete your purchase.</p>
                   </div>
                   <div className="flex items-center justify-center gap-4 text-muted-foreground mt-4 text-xs">
                     <span>Powered by Stripe</span>
                     <Separator orientation="vertical" className="h-4" />
                     <span>SSL Secure</span>
                   </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-lg border bg-background p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-4">
                      {cartItems.map(item => (
                          <div key={item.id} className="flex items-start gap-4">
                              <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                                  <Image
                                      src={Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : 'https://placehold.co/100x100/EEE/31343C'}
                                      alt={item.name}
                                      fill
                                      className="object-contain"
                                  />
                                  <span className="absolute -top-2 -right-2 bg-muted text-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                                      {item.quantity}
                                  </span>
                              </div>
                              <div className="flex-grow">
                                  <p className="font-semibold text-sm">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">{item.selectedVariant.weight}</p>
                              </div>
                              <p className="font-semibold text-sm">${(item.selectedVariant.price * item.quantity).toFixed(2)}</p>
                          </div>
                      ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                          <p className="text-muted-foreground">Subtotal</p>
                          <p className="font-semibold">${cartTotal.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between">
                          <p className="text-muted-foreground">Shipping</p>
                          <p className="font-semibold">Free</p>
                      </div>
                       <Separator className="my-2" />
                       <div className="flex justify-between font-bold text-base">
                          <p>Total</p>
                          <p>${cartTotal.toFixed(2)}</p>
                      </div>
                  </div>

                  <Button onClick={handleCheckout} disabled={isLoading || cartCount === 0 || !user || !isFormValid} size="lg" className="w-full mt-6">
                      {isLoading ? (
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                          <Lock className="mr-2 h-5 w-5" />
                      )}
                      {isLoading ? 'Processing...' : `Place Order & Pay $${cartTotal.toFixed(2)}`}
                  </Button>
                  {!user && <p className="text-xs text-center text-destructive mt-2">Please log in to place your order.</p>}
                  {user && !isFormValid && <p className="text-xs text-center text-destructive mt-2">Please provide your shipping details.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}
