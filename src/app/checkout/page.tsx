
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
    
    useEffect(() => {
        const checkUser = async () => {
            setIsCheckingAuth(true);
            const loggedIn = localStorage.getItem('isCustomerLoggedIn') === 'true';
            const userDataString = localStorage.getItem('currentUser');
            if (loggedIn && userDataString) {
                try {
                    const userData = JSON.parse(userDataString);
                    const fullUser = await getCurrentUser(userData.id);
                    setUser(fullUser);
                    if (fullUser?.address) {
                        setIsFormValid(true);
                    }
                } catch (e) {
                    console.error('Failed to fetch user', e);
                    setUser(null);
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

    /**
     * Convert full CartItem objects into lightweight CheckoutItem payloads
     * so only the data Stripe actually needs is sent to the server action.
     */
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
                toast({ title: 'Error', description: 'Payment provider could not be loaded. Check your internet connection.', variant: 'destructive' });
                return;
            }

            const { error } = await stripe.redirectToCheckout({ sessionId: result.sessionId });

            if (error) {
                console.error('Stripe redirect error:', error.message);
                toast({ title: 'Payment Error', description: error.message || 'Failed to redirect to payment page.', variant: 'destructive' });
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
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
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-emerald-50">
                        <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight font-headline">Your Cart is Empty</h1>
                    <p className="mt-3 text-muted-foreground leading-relaxed">You need to add items to your cart before you can check out.</p>
                    <Button asChild className="mt-8 rounded-full px-8 shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30">
                        <Link href="/products">Start Shopping</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
      <div className="bg-gradient-to-br from-green-50/20 via-background to-emerald-50/10">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <CheckoutProgress currentStep={2} />
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-8">
                {user ? <UserDetailsForm user={user} onFormValidityChange={setIsFormValid} /> : <CheckoutAuth />}

                <div className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm">
                  <h2 className="text-xl font-extrabold tracking-tight mb-4">Payment Method</h2>
                   <div className="border border-border/60 rounded-xl p-4">
                     <p className="text-sm leading-relaxed">You will be redirected to our secure payment partner, Stripe, to complete your purchase.</p>
                   </div>
                   <div className="flex items-center justify-center gap-4 text-muted-foreground mt-4 text-xs">
                     <span>Powered by Stripe</span>
                     <Separator orientation="vertical" className="h-4" />
                     <span>SSL Secure</span>
                   </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-border/60 bg-background p-6 sticky top-24 shadow-sm">
                  <h2 className="text-xl font-extrabold tracking-tight mb-4">Order Summary</h2>
                  <div className="space-y-4">
                      {cartItems.map(item => (
                          <div key={item.id} className="flex items-start gap-4">
                              <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                                  <Image
                                      src={Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : ''}
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
                              <span>Discount ({couponCode})</span>
                              <span>- ${discountAmount.toFixed(2)}</span>
                          </div>
                      )}
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

                  <Button onClick={handleCheckout} disabled={isLoading || cartCount === 0 || !user || !isFormValid} size="lg" className="w-full mt-6 rounded-full shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-primary/30">
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
