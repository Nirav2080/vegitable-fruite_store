
'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Loader2, ShoppingCart } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { createCheckoutSession } from '@/lib/actions/stripe'
import { getStripe } from '@/lib/stripe'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import Image from 'next/image'
import type { User } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login, register } from '@/lib/actions/auth'
import { getCurrentUser } from '@/lib/actions/users'

function LoginForm({ onLoginSuccess }: { onLoginSuccess: (user: Partial<User>) => void }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const result = await login({ email, password });
            if (result.success && result.user) {
                toast({
                    title: 'Success',
                    description: 'Logged in successfully.',
                });
                localStorage.setItem('isCustomerLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                onLoginSuccess(result.user);
                 // Manually trigger a storage event to update other components like the header
                window.dispatchEvent(new Event('storage'));
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Invalid email or password.',
                variant: 'destructive',
            });
        }
        setIsLoading(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>Enter your email and password to access your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="customer@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
                 <div className="mt-4 text-center text-sm">
                    New user?{' '}
                    <Link href="/register" className="underline">
                    Create an account
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

function UserDetails({ user }: { user: User }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Shipping Details</CardTitle>
                <CardDescription>Please confirm your information below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <Label>Name</Label>
                    <p className="text-sm font-medium">{user.name}</p>
                </div>
                <div className="space-y-1">
                    <Label>Email</Label>
                    <p className="text-sm font-medium">{user.email}</p>
                </div>
                <div className="space-y-1">
                    <Label>Mobile</Label>
                    <p className="text-sm font-medium">{user.mobile || 'Not provided'}</p>
                </div>
                 <div className="space-y-1">
                    <Label>Address</Label>
                    <p className="text-sm font-medium whitespace-pre-wrap">{user.address || 'Not provided'}</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/account/profile">Edit Details</Link>
                </Button>
            </CardContent>
        </Card>
    );
}


export default function CheckoutPage() {
    const { cartItems, cartTotal, cartCount } = useCart()
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
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
                } catch(e) {
                    console.error("failed to fetch user", e);
                }
            }
            setIsCheckingAuth(false);
        };
        checkUser();
    }, []);


    const handleLoginSuccess = async (loggedInUser: Partial<User>) => {
        if(loggedInUser.id) {
            const fullUser = await getCurrentUser(loggedInUser.id);
            setUser(fullUser);
        }
    };


    const handleCheckout = async () => {
        if (!user) {
            toast({
                title: 'Please log in',
                description: 'You must be logged in to proceed to payment.',
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
        <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold font-headline">Checkout</h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                     {user ? (
                        <UserDetails user={user} />
                    ) : (
                        <LoginForm onLoginSuccess={handleLoginSuccess} />
                    )}
                </div>
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
                     <div className="border rounded-lg p-6 bg-muted/20 mt-6">
                        <p className="text-muted-foreground">You will be redirected to our secure payment partner, Stripe, to complete your purchase.</p>
                        <Button onClick={handleCheckout} disabled={isLoading || cartCount === 0 || !user} size="lg" className="w-full mt-6">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Proceed to Payment'
                            )}
                        </Button>
                         {!user && <p className="text-xs text-destructive mt-2">Please log in to proceed to payment.</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}
