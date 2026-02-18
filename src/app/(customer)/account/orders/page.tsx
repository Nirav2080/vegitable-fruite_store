
'use client';

import { useState, useEffect } from "react";
import { getOrdersByUserId, cancelOrder } from "@/lib/actions/orders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Eye, XCircle } from "lucide-react";
import type { Order } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { cn } from "@/lib/utils";


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

export default function AccountOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const userDataString = localStorage.getItem('currentUser');
                if (!userDataString) {
                    setOrders([]);
                    setIsLoading(false);
                    return;
                }
                const userData = JSON.parse(userDataString);
                const fetchedOrders = await getOrdersByUserId(userData.id);
                setOrders(fetchedOrders);
            } catch (error) {
                toast({ title: "Error", description: "Could not fetch orders." });
            }
            setIsLoading(false);
        };
        fetchOrders();
    }, [toast]);

    const handleCancelClick = (orderId: string) => {
        setSelectedOrderId(orderId);
        setIsDialogOpen(true);
    };

    const handleConfirmCancel = async () => {
        if (!selectedOrderId) return;
        try {
            await cancelOrder(selectedOrderId);
            toast({
                title: "Order Cancelled",
                description: "Your order has been successfully cancelled.",
            });
            // Re-fetch orders to update the list
            const userDataString = localStorage.getItem('currentUser');
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                const fetchedOrders = await getOrdersByUserId(userData.id);
                setOrders(fetchedOrders);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "There was a problem cancelling your order.",
                variant: "destructive",
            });
        } finally {
            setIsDialogOpen(false);
            setSelectedOrderId(null);
        }
    };
    
    if (isLoading) {
        return <div>Loading orders...</div>
    }

    return (
        <div>
            <h2 className="text-2xl font-extrabold tracking-tight font-headline mb-4">My Orders</h2>
             <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-[150px] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id.slice(-6)}</TableCell>
                         <TableCell>
                            {format(new Date(order.date), 'dd MMM yyyy')}
                        </TableCell>
                        <TableCell>
                        <Badge className={cn(getStatusClass(order.status), 'rounded-full')} variant="outline">
                            {order.status}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                        <TableCell className="text-right flex gap-2 justify-end">
                           <Button asChild variant="outline" size="icon" className="rounded-full border-border/60 transition-all duration-200 hover:shadow-sm">
                               <Link href={`/order/${order.id}`}>
                                   <Eye className="h-4 w-4" />
                               </Link>
                           </Button>
                           {order.status === 'Pending' && (
                                <Button 
                                    variant="destructive" 
                                    size="icon"
                                    onClick={() => handleCancelClick(order.id)}
                                >
                                    <XCircle className="h-4 w-4" />
                                </Button>
                            )}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to cancel this order?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. You will not be charged.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Back to safety</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmCancel} className="bg-destructive hover:bg-destructive/90">Yes, Cancel Order</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
