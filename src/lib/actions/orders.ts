
'use server'

import type { Order, OrderItem, User } from '@/lib/types';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';

async function getDb() {
    if (!clientPromise) return null;
    const client = await clientPromise;
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

export async function createOrder(stripeSessionId: string, clientReferenceId: string, cartItems: any[], totalAmount: number, customerEmail: string): Promise<Order> {
    const db = await getDb();
    if (!db) throw new Error("Database not connected.");
    const ordersCollection = db.collection<Order>('orders');
    
    // Check if an order for this session already exists
    const existingOrder = await ordersCollection.findOne({ stripeSessionId });
    if (existingOrder) {
        return serializeOrder(existingOrder);
    }
    
    const usersCollection = db.collection<User>('users');
    
    const user = await usersCollection.findOne({ _id: new ObjectId(clientReferenceId) });
    if (!user) {
        throw new Error('User not found');
    }

    const orderItems: OrderItem[] = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        weight: item.weight,
    }));

    const newOrder: Omit<Order, 'id'> = {
        stripeSessionId,
        customerName: user.name,
        email: customerEmail,
        date: new Date(),
        status: 'Pending',
        total: totalAmount / 100, // Convert from cents
        items: orderItems,
    };

    const result = await ordersCollection.insertOne(newOrder as any);

    // Update user's order stats
    await usersCollection.updateOne(
        { _id: new ObjectId(clientReferenceId) },
        { 
            $inc: { orderCount: 1, totalSpent: newOrder.total }
        }
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
