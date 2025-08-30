
'use server'

import type { Order } from '@/lib/types';
import clientPromise from '@/lib/db';

async function getDb() {
    const client = await clientPromise;
    return client.db(process.env.DB_NAME || 'aotearoa-organics');
}

async function getOrdersCollection() {
    const db = await getDb();
    return db.collection<Order>('orders');
}

function serializeOrder(order: any): Order {
    const { _id, ...rest } = order;
    return {
        ...rest,
        id: _id.toString(),
    } as Order;
}


export async function getOrders(): Promise<Order[]> {
    const ordersCollection = await getOrdersCollection();
    const orders = await ordersCollection.find({}).sort({ date: -1 }).toArray();
    return orders.map(serializeOrder);
}
