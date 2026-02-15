
import { getOrderById } from "@/lib/actions/orders";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderDetails } from "./_components/OrderDetails";
import { getProductById } from "@/lib/cached-data";

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
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Order Details</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Order #{order.id.slice(-6).toUpperCase()}</CardTitle>
                    <CardDescription>
                        Manage this order and view its details.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <OrderDetails order={order} />
                </CardContent>
            </Card>
        </div>
    );
}
