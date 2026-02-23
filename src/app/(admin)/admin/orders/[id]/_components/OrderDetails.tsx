
'use client'

import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updateOrderStatus } from '@/lib/actions/orders';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Order, EnrichedOrderItem } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ImageIcon, Clock, Package, Truck, CheckCircle2, XCircle, User, Mail, CalendarDays, Save, Phone, MapPin } from 'lucide-react';

interface OrderDetailsProps {
    order: Order & { items: EnrichedOrderItem[] };
}

const orderStatuses: Order['status'][] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const statusConfig: Record<string, { icon: typeof Clock; color: string; bgColor: string }> = {
    Pending: { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    Processing: { icon: Package, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    Shipped: { icon: Truck, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    Delivered: { icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100' },
    Cancelled: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
};

const getStatusBadge = (status: Order['status']) => {
    const config = statusConfig[status] || statusConfig.Pending;
    const Icon = config.icon;
    return (
        <Badge className={`${config.bgColor} ${config.color} gap-1 text-xs font-medium`}>
            <Icon className="h-3 w-3" /> {status}
        </Badge>
    );
};


export function OrderDetails({ order }: OrderDetailsProps) {
    const [status, setStatus] = useState<Order['status']>(order.status);
    const [isUpdating, setIsUpdating] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    
    const subtotal = order.total + (order.discountAmount || 0);

    const handleStatusUpdate = async () => {
        setIsUpdating(true);
        try {
            await updateOrderStatus(order.id, status);
            toast({
                title: 'Success',
                description: 'Order status updated successfully.',
            });
            router.refresh();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update order status.',
                variant: 'destructive',
            });
        } finally {
            setIsUpdating(false);
        }
    };

    // Status timeline
    const statusOrder = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const isCancelled = order.status === 'Cancelled';
    const currentIndex = statusOrder.indexOf(order.status);

    return (
        <div className="space-y-6">
            {/* Status Timeline */}
            <Card className="rounded-2xl border-border/30">
                <CardContent className="pt-6">
                    {isCancelled ? (
                        <div className="flex items-center justify-center gap-3 py-4">
                            <div className="rounded-full bg-red-100 p-3">
                                <XCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-red-600">Order Cancelled</p>
                                <p className="text-sm text-muted-foreground">This order has been cancelled.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            {statusOrder.map((s, i) => {
                                const config = statusConfig[s];
                                const Icon = config.icon;
                                const isActive = i <= currentIndex;
                                const isLast = i === statusOrder.length - 1;
                                return (
                                    <div key={s} className="flex items-center flex-1">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className={`rounded-full p-2.5 transition-colors ${isActive ? `${config.bgColor}` : 'bg-muted'}`}>
                                                <Icon className={`h-5 w-5 ${isActive ? config.color : 'text-muted-foreground'}`} />
                                            </div>
                                            <span className={`text-xs font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{s}</span>
                                        </div>
                                        {!isLast && (
                                            <div className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-colors ${i < currentIndex ? 'bg-primary' : 'bg-muted'}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <Card className="lg:col-span-2 rounded-2xl border-border/30">
                    <CardHeader>
                        <CardTitle className="text-lg">Order Items ({order.items.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {order.items.map((item: EnrichedOrderItem, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 border border-border/30 rounded-xl hover:bg-muted/30 transition-colors">
                                <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="font-semibold truncate">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.weight}</p>
                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                                </div>
                                <p className="font-semibold text-nowrap">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}

                        <Separator className="my-4" />

                        <div className="space-y-2 px-1">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            {order.discountAmount ? (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount ({order.couponCode})</span>
                                    <span>-${order.discountAmount.toFixed(2)}</span>
                                </div>
                            ) : null}
                            <Separator className="my-2" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Update Status */}
                    <Card className="rounded-2xl border-border/30">
                        <CardHeader>
                            <CardTitle className="text-lg">Update Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Current:</span>
                                {getStatusBadge(order.status)}
                            </div>
                            <Select value={status} onValueChange={(value: Order['status']) => setStatus(value)}>
                                <SelectTrigger className="rounded-lg">
                                    <SelectValue placeholder="Change status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border/30">
                                    {orderStatuses.map(s => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleStatusUpdate} disabled={isUpdating || status === order.status} className="w-full rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                                <Save className="mr-2 h-4 w-4" />
                                {isUpdating ? 'Updating...' : 'Update Status'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Customer Info */}
                    <Card className="rounded-2xl border-border/30">
                        <CardHeader>
                            <CardTitle className="text-lg">Customer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-muted p-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <span className="font-medium">{order.customerName}</span>
                                    {order.userId && (
                                        <p className="text-xs text-muted-foreground">ID: {order.userId}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-muted p-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="text-sm text-muted-foreground">{order.email}</span>
                            </div>
                            {order.phone && (
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-muted p-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <span className="text-sm text-muted-foreground">{order.phone}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-muted p-2">
                                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="text-sm text-muted-foreground">{format(new Date(order.date), 'dd MMM yyyy, h:mm a')}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                        <Card className="rounded-2xl border-border/30">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> Shipping Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm space-y-0.5">
                                    <p>{order.shippingAddress.street}</p>
                                    {order.shippingAddress.suburb && <p className="text-muted-foreground">{order.shippingAddress.suburb}</p>}
                                    <p className="text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.postcode}</p>
                                    <p className="text-muted-foreground">{order.shippingAddress.country || 'New Zealand'}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Billing Address */}
                    {order.billingAddress && (
                        <Card className="rounded-2xl border-border/30">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Mail className="h-4 w-4" /> Billing Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm space-y-0.5">
                                    <p>{order.billingAddress.street}</p>
                                    {order.billingAddress.suburb && <p className="text-muted-foreground">{order.billingAddress.suburb}</p>}
                                    <p className="text-muted-foreground">{order.billingAddress.city}, {order.billingAddress.region} {order.billingAddress.postcode}</p>
                                    <p className="text-muted-foreground">{order.billingAddress.country || 'New Zealand'}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
