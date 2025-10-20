
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
        const priceInCents = Math.round(item.selectedVariant.price * 100);

        let imageUrl: string | undefined;
        if (Array.isArray(item.images) && item.images.length > 0) {
            imageUrl = item.images[0];
        } else if (typeof item.images === 'string') {
            imageUrl = item.images;
        }

        return {
            price_data: {
                currency: 'nzd',
                product_data: {
                    name: item.name,
                    description: item.selectedVariant.weight,
                    images: imageUrl ? [imageUrl] : [],
                },
                unit_amount: priceInCents,
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
