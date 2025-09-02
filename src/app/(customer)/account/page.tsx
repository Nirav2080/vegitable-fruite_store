
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { User, Package } from 'lucide-react';
import { getOrders } from '@/lib/actions/orders';
import { getCurrentUser } from '@/lib/actions/users';

export default async function AccountPage() {
    const orders = await getOrders();
    const user = await getCurrentUser();
    const orderCount = orders.length;

    if (!user) {
        return (
            <div>
                 <h2 className="text-2xl font-bold font-headline">Account Dashboard</h2>
                 <p className="text-muted-foreground">Please log in to view your account details.</p>
            </div>
        )
    }
    
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
