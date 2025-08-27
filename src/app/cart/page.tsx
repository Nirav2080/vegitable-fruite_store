'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { products } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { X, Plus, Minus } from 'lucide-react'

const initialCartItems = [
  { ...products[0], quantity: 2 },
  { ...products[2], quantity: 1 },
  { ...products[4], quantity: 3 },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: newQuantity } : item))
  }
  
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping = 10.00
  const total = subtotal + shipping

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Your Shopping Cart</h1>
        <p className="mt-2 text-muted-foreground">Review your items and proceed to checkout.</p>
      </header>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl mb-4">Your cart is empty.</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] hidden md:table-cell">Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="hidden md:table-cell">
                          <Image src={item.images[0]} alt={item.name} width={64} height={64} className="rounded-md object-cover" />
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link href={`/products/${item.slug}`} className="hover:text-primary">{item.name}</Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center border rounded-md w-fit">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">${(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                            <X className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                   <Link href="/products">Continue Shopping</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
