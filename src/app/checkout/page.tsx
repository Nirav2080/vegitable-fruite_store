
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Loader2, ShoppingCart, Lock, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { createCheckoutSession } from '@/lib/actions/stripe'
import { getStripe } from '@/lib/stripe'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import Image from 'next/image'
import type { User, CheckoutItem } from '@/lib/types'
import { getCurrentUser } from '@/lib/actions/users'
import { CheckoutProgress } from './_components/CheckoutProgress'
import { CheckoutAuth } from './_components/CheckoutAuth'
import { UserDetailsForm } from './_components/UserDetailsForm'


export default function CheckoutPage() {
    const { cartItems, originalSubtotal, savingsFromSales, cartTotal, cartCount, couponCode, discountAmount } = useCart()
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isFormValid, setIsFormValid] = useState(false);
    const { toast } = useToast();

    const refreshUser = useCallback(async () => {
        setIsCheckingAuth(true);
        const loggedIn = localStorage.getItem('isCustomerLoggedIn') === 'true';
        const userDataString = localStorage.getItem('currentUser');
        if (loggedIn && userDataString) {
            try {
                const userData = JSON.parse(userDataString);
                const fullUser = await getCurrentUser(userData.id);
                setUser(fullUser);
                if (fullUser?.shippingAddress?.street) {
                    setIsFormValid(true);
                }
            } catch (e) {
                console.error('Failed to fetch user', e);
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setIsCheckingAuth(false);
    }, []);
    
    useEffect(() => {
        refreshUser();
        const handleLoginStateChange = () => refreshUser();
        window.addEventListener('loginStateChange', handleLoginStateChange);
        return () => {
            window.removeEventListener('loginStateChange', handleLoginStateChange);
        };
    }, [refreshUser]);

    const handleUserUpdate = useCallback((updatedUser: User) => {
        setUser(updatedUser);
        if (updatedUser.shippingAddress?.street) {
            setIsFormValid(true);
        }
    }, []);

    const buildCheckoutItems = (): CheckoutItem[] =>
        cartItems.map((item) => ({
            productId: item.id.split('_')[0],
            name: item.name,
            image: Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null,
            weight: item.selectedVariant.weight,
            price: item.selectedVariant.price,
            quantity: item.quantity,
        }));

    const handleCheckout = async () => {
        if (!user) {
            toast({ title: 'Please log in', description: 'You must be logged in to place an order.', variant: 'destructive' });
            return;
        }
        if (!isFormValid) {
            toast({ title: 'Shipping Information Required', description: 'Please fill out and save your shipping details.', variant: 'destructive' });
            return;
        }
        if (cartCount === 0) {
            toast({ title: 'Cart is empty', description: 'Add items to your cart before checking out.', variant: 'destructive' });
            return;
        }

        setIsLoading(true);
        try {
            const checkoutItems = buildCheckoutItems();
            const result = await createCheckoutSession(checkoutItems, couponCode, user.id);

            if (!result.success) {
                toast({ title: 'Checkout Error', description: result.error, variant: 'destructive' });
                return;
            }

            const stripe = await getStripe();
            if (!stripe) {
                toast({ title: 'Error', description: 'Payment provider could not be loaded.', variant: 'destructive' });
                return;
            }

            const { error } = await stripe.redirectToCheckout({ sessionId: result.sessionId });
            if (error) {
                toast({ title: 'Payment Error', description: error.message || 'Failed to redirect to payment page.', variant: 'destructive' });
            }
        } catch (error: any) {
            toast({ title: 'Error', description: error.message || 'Something went wrong. Please try again.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    }

    if (isCheckingAuth) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
                 <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" />
            </div>
        )
    }

    if (cartCount === 0 && !isLoading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
                <div className="mx-auto max-w-md">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/50">
                        <ShoppingCart className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">Your Cart is Empty</h1>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">You need to add items to your cart before you can check out.</p>
                    <Button asChild className="mt-8 rounded-xl px-8 shadow-sm">
                        <Link href="/products">Start Shopping</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <CheckoutProgress currentStep={2} />
            
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              {/* Left: Forms */}
              <div className="lg:col-span-3 space-y-6">
                {user ? (
                    <UserDetailsForm user={user} onFormValidityChange={setIsFormValid} onUserUpdate={handleUserUpdate} />
                ) : (
                    <CheckoutAuth />
                )}

                <div className="rounded-2xl border border-border/30 bg-background p-6 shadow-sm">
                  <h2 className="text-sm font-bold tracking-tight mb-3 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">3</div>
                    Payment Method
                  </h2>
                  <div className="border border-border/30 rounded-xl p-4 bg-secondary/20">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <p className="text-sm leading-relaxed">You will be redirected to our secure payment partner, <span className="font-semibold">Stripe</span>, to complete your purchase.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-muted-foreground mt-4 text-xs">
                    <span>Powered by Stripe</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span>256-bit SSL Secure</span>
                  </div>
                </div>
              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl border border-border/30 bg-background p-6 sticky top-24 shadow-sm">
                  <h2 className="text-sm font-bold tracking-tight mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex items-start gap-3">
                            <div className="relative h-14 w-14 rounded-lg overflow-hidden border flex-shrink-0">
                                <Image
                                    src={Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : ''}
                                    alt={item.name}
                                    fill
                                    className="object-contain"
                                />
                                <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                    {item.quantity}
                                </span>
                            </div>
                            <div className="flex-grow min-w-0">
                                <p className="font-semibold text-sm leading-tight truncate">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.selectedVariant.weight}</p>
                            </div>
                            <p className="font-semibold text-sm whitespace-nowrap">${(item.selectedVariant.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                          <p className="text-muted-foreground">Subtotal ({cartCount} items)</p>
                          <p className="font-semibold">${originalSubtotal.toFixed(2)}</p>
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
                          <p className="text-muted-foreground">Shipping</p>
                          <p className="font-semibold text-green-600">Free</p>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold text-lg">
                          <p>Total (NZD)</p>
                          <p>${cartTotal.toFixed(2)}</p>
                      </div>
                  </div>

                  <Button onClick={handleCheckout} disabled={isLoading || cartCount === 0 || !user || !isFormValid} size="lg" className="w-full mt-6 rounded-xl shadow-sm">
                      {isLoading ? (
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                          <Lock className="mr-2 h-5 w-5" />
                      )}
                      {isLoading ? 'Processing...' : `Place Order & Pay $${cartTotal.toFixed(2)}`}
                  </Button>
                  {!user && <p className="text-xs text-center text-destructive mt-2">Please log in or create an account to place your order.</p>}
                  {user && !isFormValid && <p className="text-xs text-center text-destructive mt-2">Please provide your shipping details above.</p>}

                  <div className="mt-5 pt-4 border-t border-border/40">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="text-[10px] text-muted-foreground leading-tight">Secure Payment</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Truck className="h-4 w-4 text-green-600" />
                        <span className="text-[10px] text-muted-foreground leading-tight">NZ Delivery</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <RotateCcw className="h-4 w-4 text-green-600" />
                        <span className="text-[10px] text-muted-foreground leading-tight">Easy Returns</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}
