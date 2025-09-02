
'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { User, Package } from 'lucide-react';
import { getOrders } from '@/lib/actions/orders';
import { getCurrentUser } from '@/lib/actions/users';
import { useEffect, useState } from 'react';
import type { User as UserType, Order as OrderType } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function AccountDashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-2/3 mt-2" />
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-6 w-1/4 mt-2" />
                    </CardContent>
                </Card>
                 <Card>
                     <CardHeader>
                        <Skeleton className="h-6 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-6 w-1/4 mt-2" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function AccountPage() {
    const [user, setUser] = useState<UserType | null>(null);
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const userDataString = localStorage.getItem('currentUser');
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                const [user, orders] = await Promise.all([
                    getCurrentUser(userData.id),
                    getOrders() 
                ]);
                setUser(user);
                setOrders(orders);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);


    if(isLoading) {
        return <AccountDashboardSkeleton />
    }

    if (!user) {
        return (
            <div>
                 <h2 className="text-2xl font-bold font-headline">Account Dashboard</h2>
                 <p className="text-muted-foreground">Please log in to view your account details.</p>
            </div>
        )
    }

    const orderCount = orders.length;
    
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold font-headline">Account Dashboard</h2>
                <p className="text-muted-foreground">From your account dashboard you can view your recent orders and edit your password and account details.</p>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            <span>My Profile</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <Button asChild variant="link" className="px-0">
                            <Link href="/account/profile">Edit Profile</Link>
                        </Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Package className="w-5 h-5" />
                           <span>My Orders</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>You have made {orderCount} {orderCount === 1 ? 'order' : 'orders'}.</p>
                        <p className="text-sm text-muted-foreground">View your order history</p>
                         <Button asChild variant="link" className="px-0">
                            <Link href="/account/orders">View All Orders</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
