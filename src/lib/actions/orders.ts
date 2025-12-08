
'use server'

import type { Order, OrderItem, User } from '@/lib/types';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

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

export async function getOrderById(id: string): Promise<Order | null> {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    const ordersCollection = await getOrdersCollection();
    const order = await ordersCollection.findOne({ _id: new ObjectId(id) });
    if (!order) {
        return null;
    }
    return serializeOrder(order);
}

export async function createOrder(stripeSessionId: string, clientReferenceId: string, cartItems: any[], totalAmount: number, customerEmail: string): Promise<Order> {
    const db = await getDb();
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
