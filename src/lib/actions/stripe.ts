
'use server'

import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import type { CartItem } from '@/lib/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-06-20',
});

export async function createCheckoutSession(cartItems: CartItem[]) {

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map((item) => {
        const price = item.selectedVariant.price * 100;
        return {
            price_data: {
                currency: 'nzd',
                product_data: {
                    name: item.name,
                    description: item.selectedVariant.weight,
                    images: Array.isArray(item.images) && item.images.length > 0 ? [item.images[0]] : [],
                },
                unit_amount: price,
            },
            quantity: item.quantity,
        };
    });

    const host = headers().get('host') || 'localhost:9002';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${protocol}://${host}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${protocol}://${host}/checkout/cancel`,
    });

    if (session.id) {
        return { sessionId: session.id };
    } else {
        throw new Error('Failed to create Stripe checkout session');
    }
}

export async function retrieveCheckoutSession(sessionId: string) {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        return {
            status: session.status,
            customer_email: session.customer_details?.email
        };
    } catch (error) {
        console.error("Error retrieving session: ", error);
        return null;
    }
}
