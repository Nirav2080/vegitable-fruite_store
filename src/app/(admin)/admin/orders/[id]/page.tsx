
import { getOrderById } from "@/lib/actions/orders";
import { notFound } from "next/navigation";
import { OrderDetails } from "./_components/OrderDetails";
import { getProductById } from "@/lib/cached-data";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getOrderDetailsWithProductInfo(orderId: string) {
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


export default async function AdminOrderDetailsPage({ params }: { params: { id: string } }) {
    const order = await getOrderDetailsWithProductInfo(params.id);

    if (!order) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" size="icon" className="rounded-xl border-border/30 h-9 w-9">
                        <Link href="/admin/orders"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Order #{order.id.slice(-6).toUpperCase()}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Placed on {format(new Date(order.date), 'dd MMM yyyy, h:mm a')} · {order.customerName}
                        </p>
                    </div>
                </div>
            </div>
            <OrderDetails order={order} />
        </div>
    );
}
