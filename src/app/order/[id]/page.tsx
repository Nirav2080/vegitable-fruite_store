
import { getOrderById } from "@/lib/actions/orders";
import { getProductById } from "@/lib/cached-data";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { CheckCircle, ImageIcon } from "lucide-react";

async function getOrderDetails(orderId: string) {
    const order = await getOrderById(orderId);
    if (!order) return null;

    const itemsWithDetails = await Promise.all(order.items.map(async (item) => {
        const product = await getProductById(item.productId);
        return {
            ...item,
            name: product?.name || 'Unknown Product',
            image: (product?.images && product.images.length > 0) ? product.images[0] : ''
        };
    }));

    return { ...order, items: itemsWithDetails };
}


export default async function OrderConfirmationPage({ params }: { params: { id: string } }) {
    const order = await getOrderDetails(params.id);

    if (!order) {
        notFound();
    }

    const subtotal = order.total + (order.discountAmount || 0);

    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-3xl font-bold font-headline">Thank you for your order!</CardTitle>
                    <CardDescription>Your order has been placed successfully. A confirmation has been sent to {order.email}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted/50 p-4 rounded-lg text-center mb-6">
                        <p className="text-sm text-muted-foreground">Order ID</p>
                        <p className="font-mono font-semibold text-lg">{order.id}</p>
                    </div>

                    <div className="flex justify-between text-sm text-muted-foreground mb-4">
                        <p>Order Date: <span className="font-medium text-foreground">{format(order.date, 'dd MMMM yyyy')}</span></p>
                        <p>Status: <span className="font-medium text-foreground">{order.status}</span></p>
                    </div>

                    <Separator />
                    
                    <div className="space-y-4 my-6">
                         <h3 className="font-semibold">Items Ordered</h3>
                        {order.items.map((item, index) => (
                             <div key={index} className="flex items-center gap-4">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                                    ) : (
                                        <div className="h-full w-full bg-muted flex items-center justify-center">
                                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.weight}</p>
                                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                     <Separator />

                     <div className="space-y-2 mt-6">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        {order.discountAmount && order.discountAmount > 0 ? (
                            <div className="flex justify-between text-green-600">
                                <span>Discount ({order.couponCode})</span>
                                <span>-${order.discountAmount.toFixed(2)}</span>
                            </div>
                        ) : null}
                         <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button asChild className="w-full">
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                     <Button asChild variant="ghost" className="w-full">
                        <Link href="/account/orders">View Order History</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
