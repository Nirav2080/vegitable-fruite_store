
'use client'

import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateOrderStatus } from '@/lib/actions/orders';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Order } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface OrderDetailsProps {
    order: Order & { items: (Order['items'][0] & { name: string; image: string; })[] };
}

const orderStatuses: Order['status'][] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const getStatusClass = (status: Order['status']) => {
     switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
}


export function OrderDetails({ order }: OrderDetailsProps) {
    const [status, setStatus] = useState<Order['status']>(order.status);
    const [isUpdating, setIsUpdating] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleStatusUpdate = async () => {
        setIsUpdating(true);
        try {
            await updateOrderStatus(order.id, status);
            toast({
                title: 'Success',
                description: 'Order status updated successfully.',
            });
            router.refresh();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update order status.',
                variant: 'destructive',
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Order Items</h3>
                    <div className="space-y-4">
                        {order.items.map((item, index) => (
                             <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                    <Image src={item.image} alt={item.name} fill className="object-contain" />
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
                </div>
            </div>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Order Status</h3>
                    <div className="flex items-center gap-2">
                        <Select value={status} onValueChange={(value: Order['status']) => setStatus(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                                {orderStatuses.map(s => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleStatusUpdate} disabled={isUpdating || status === order.status}>
                            {isUpdating ? 'Updating...' : 'Save'}
                        </Button>
                    </div>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold">Customer Details</h3>
                    <div className="text-sm text-muted-foreground mt-2 space-y-1">
                        <p><span className="font-medium text-foreground">Name:</span> {order.customerName}</p>
                        <p><span className="font-medium text-foreground">Email:</span> {order.email}</p>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Order Information</h3>
                     <div className="text-sm text-muted-foreground mt-2 space-y-1">
                        <p><span className="font-medium text-foreground">Date:</span> {format(new Date(order.date), 'dd MMM yyyy, h:mm a')}</p>
                        <p><span className="font-medium text-foreground">Current Status:</span> <Badge className={getStatusClass(order.status)}>{order.status}</Badge></p>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-bold text-base text-foreground">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
