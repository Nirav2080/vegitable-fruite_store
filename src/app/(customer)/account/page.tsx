
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
                 <h2 className="text-2xl font-extrabold tracking-tight font-headline">Account Dashboard</h2>
                 <p className="text-muted-foreground leading-relaxed">Please log in to view your account details.</p>
            </div>
        )
    }

    const orderCount = orders.length;
    
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-extrabold tracking-tight font-headline">Account Dashboard</h2>
                <p className="text-muted-foreground leading-relaxed">From your account dashboard you can view your recent orders and edit your password and account details.</p>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Card className="rounded-2xl border-border/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 hover:border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <User className="w-4 h-4 text-primary" />
                            </div>
                            <span>My Profile</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.mobile && <p className="text-sm text-muted-foreground">{user.mobile}</p>}
                        {user.address && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{user.address}</p>}
                        <Button asChild variant="link" className="px-0 pt-2 text-primary">
                            <Link href="/account/profile">Edit Profile</Link>
                        </Button>
                    </CardContent>
                </Card>
                 <Card className="rounded-2xl border-border/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 hover:border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <Package className="w-4 h-4 text-primary" />
                            </div>
                           <span>My Orders</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>You have made {orderCount} {orderCount === 1 ? 'order' : 'orders'}.</p>
                        <p className="text-sm text-muted-foreground">View your order history</p>
                         <Button asChild variant="link" className="px-0 text-primary">
                            <Link href="/account/orders">View All Orders</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
