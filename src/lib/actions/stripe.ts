
'use server'

import Stripe from 'stripe';
import { headers } from 'next/headers';
import type { CartItem, User } from '@/lib/types';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-06-20',
});

async function getDb() {
    const client = await clientPromise;
    return client.db(process.env.DB_NAME || 'aotearoa-organics');
}

async function getCurrentUser(): Promise<User | null> {
    const usersCollection = (await getDb()).collection<User>('users');
    // In a real app, you would get this from a session
    const user = await usersCollection.findOne({});
    if (!user) return null;
    return { ...user, id: user._id.toString() } as User;
}

export async function createCheckoutSession(cartItems: CartItem[]) {
    const host = headers().get('origin') || 'http://localhost:9002';

    const user = await getCurrentUser();

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map((item) => {
        const priceInCents = Math.round(item.selectedVariant.price * 100);
        
        return {
            price_data: {
                currency: 'nzd',
                product_data: {
                    name: item.name,
                    description: item.selectedVariant.weight,
                },
                unit_amount: priceInCents,
            },
            quantity: item.quantity,
        };
    });

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${host}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${host}/checkout/cancel`,
            client_reference_id: user?.id,
            metadata: {
                cartItems: JSON.stringify(cartItems.map(item => ({
                    productId: item.id.split('_')[0], // Get original product ID
                    quantity: item.quantity,
                    price: item.selectedVariant.price,
                    weight: item.selectedVariant.weight
                })))
            }
        });

        if (session.id) {
            return { sessionId: session.id };
        } else {
            throw new Error('Failed to create Stripe checkout session');
        }
    } catch (error: any) {
        console.error("Stripe session creation failed:", error);
        throw new Error('Could not create checkout session.');
    }
}

export async function retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session | null> {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        return session;
    } catch (error) {
        console.error("Error retrieving session: ", error);
        return null;
    }
}
