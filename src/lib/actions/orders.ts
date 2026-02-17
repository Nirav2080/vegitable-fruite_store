
'use server'

import type { Order, OrderItem, User } from '@/lib/types';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';

async function getDb() {
    const client = await clientPromise;
    if (!client) {
      return null;
    }
    return client.db(process.env.DB_NAME || 'aotearoa-organics');
}

async function getOrdersCollection() {
    const db = await getDb();
    if (!db) return null;
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
    if (!ordersCollection) return [];
    const orders = await ordersCollection.find({}).sort({ date: -1 }).toArray();
    return orders.map(serializeOrder);
}

export async function getOrderById(id: string): Promise<Order | null> {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    const ordersCollection = await getOrdersCollection();
    if (!ordersCollection) return null;
    const order = await ordersCollection.findOne({ _id: new ObjectId(id) });
    if (!order) {
        return null;
    }
    return serializeOrder(order);
}

type ShortCartItem = {
    p: string; // productId
    q: number; // quantity
    pr: number; // price
    w: string; // weight
}

export async function createOrder(
    stripeSessionId: string, 
    clientReferenceId: string, 
    cartData: ShortCartItem[], 
    totalAmount: number, 
    customerEmail: string,
    discountInfo: { amount: number; code?: string | null }
): Promise<Order> {
    const db = await getDb();
    if (!db) throw new Error('Database not connected.');
    const ordersCollection = db.collection<Order>('orders');
    
    // Idempotency: if an order for this session already exists, return it
    const existingOrder = await ordersCollection.findOne({ stripeSessionId });
    if (existingOrder) {
        return serializeOrder(existingOrder);
    }

    // Validate cartData
    if (!Array.isArray(cartData) || cartData.length === 0) {
        throw new Error('Cart data is invalid or empty.');
    }
    
    const usersCollection = db.collection<User>('users');
    
    let user: any = null;
    if (ObjectId.isValid(clientReferenceId)) {
        user = await usersCollection.findOne({ _id: new ObjectId(clientReferenceId) });
    }
    if (!user) {
        throw new Error('User not found for the given client reference.');
    }

    const orderItems: OrderItem[] = cartData.map(item => ({
        productId: item.p,
        quantity: item.q,
        price: item.pr,
        weight: item.w,
    }));

    const newOrder: Omit<Order, 'id'> = {
        stripeSessionId,
        customerName: user.name,
        email: customerEmail,
        date: new Date(),
        status: 'Pending',
        total: totalAmount / 100, // Convert from cents
        items: orderItems,
        discountAmount: (discountInfo.amount || 0) / 100,
        couponCode: discountInfo.code ?? undefined,
    };

    const result = await ordersCollection.insertOne(newOrder as any);

    // Update user's order stats
    await usersCollection.updateOne(
        { _id: new ObjectId(clientReferenceId) },
        { $inc: { orderCount: 1, totalSpent: newOrder.total } }
    );
    
    revalidatePath('/admin/orders');
    revalidatePath('/account');

    return { ...newOrder, id: result.insertedId.toString() };
}

export async function updateOrderStatus(orderId: string, status: Order['status']) {
    if (!ObjectId.isValid(orderId)) {
        throw new Error('Invalid Order ID');
    }

    const ordersCollection = await getOrdersCollection();
    if (!ordersCollection) throw new Error("Database not connected.");
    const result = await ordersCollection.updateOne(
        { _id: new ObjectId(orderId) },
        { $set: { status } }
    );

    if (result.matchedCount === 0) {
        notFound();
    }

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);
}


export async function cancelOrder(orderId: string) {
    if (!ObjectId.isValid(orderId)) {
        throw new Error('Invalid Order ID');
    }

    const ordersCollection = await getOrdersCollection();
    if (!ordersCollection) throw new Error("Database not connected.");
    
    const orderToCancel = await ordersCollection.findOne({ _id: new ObjectId(orderId) });

    if (!orderToCancel) {
        notFound();
    }

    if (orderToCancel.status !== 'Pending') {
        throw new Error('Only pending orders can be cancelled.');
    }

    const result = await ordersCollection.updateOne(
        { _id: new ObjectId(orderId) },
        { $set: { status: 'Cancelled' } }
    );

    if (result.matchedCount === 0) {
        notFound();
    }

    revalidatePath('/admin/orders');
    revalidatePath('/account/orders');
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
}
