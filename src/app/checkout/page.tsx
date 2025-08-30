
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { getProducts } from '@/lib/actions/products'
import { CreditCard, Loader2 } from 'lucide-react'
import Image from 'next/image'
import type { Product } from '@/lib/types'

type CartItem = Product & { quantity: number };

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCartItems() {
      setIsLoading(true);
       // In a real app, you'd fetch this from localStorage or a DB
      // For this demo, we'll randomly pick some products
      const allProducts = await getProducts();
      if (allProducts.length > 2) {
        const items = [
            { ...allProducts[0], quantity: 2 },
            { ...allProducts[2], quantity: 1 },
        ].filter(Boolean);
        setCartItems(items);
      }
      setIsLoading(false);
    }
    fetchCartItems();
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping = 10.00
  const total = subtotal + shipping

  if (isLoading) {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Loading checkout...</p>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Checkout</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Main Street" />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Auckland" />
              </div>
              <div>
                <Label htmlFor="region">Region</Label>
                 <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auckland">Auckland</SelectItem>
                    <SelectItem value="wellington">Wellington</SelectItem>
                    <SelectItem value="canterbury">Canterbury</SelectItem>
                    <SelectItem value="otago">Otago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="font-headline">Payment</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
               <div>
                <Label htmlFor="card-number">Card Number</Label>
                <div className="relative">
                  <Input id="card-number" placeholder="•••• •••• •••• ••••" />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry-date">Expiry Date</Label>
                  <Input id="expiry-date" placeholder="MM / YY" />
                </div>
                 <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="•••" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="font-headline">Your Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Image src={item.images[0]} alt={item.name} width={48} height={48} className="rounded-md" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full">Place Order</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
