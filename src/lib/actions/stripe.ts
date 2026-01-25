
'use server'

import Stripe from 'stripe';
import { headers } from 'next/headers';
import type { CartItem, User, Offer } from '@/lib/types';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-06-20',
});

async function getDb() {
    const client = await clientPromise;
    if (!client) {
      return null;
    }
    return client.db(process.env.DB_NAME || 'aotearoa-organics');
}

async function getCurrentUser(): Promise<User | null> {
    const db = await getDb();
    if (!db) return null;
    const usersCollection = db.collection<User>('users');
    // In a real app, you would get this from a session
    const user = await usersCollection.findOne({});
    if (!user) return null;
    return { ...user, id: user._id.toString() } as User;
}

export async function createCheckoutSession(cartItems: CartItem[], couponCode: string | null) {
    const host = headers().get('origin') || 'http://localhost:9002';

    const user = await getCurrentUser();

    let stripeCouponId: string | undefined = undefined;

    if (couponCode) {
        const db = await getDb();
        if (!db) throw new Error("Database not connected for coupon validation");
        const offersCollection = db.collection<Offer>('offers');
        const offer = await offersCollection.findOne({ code: couponCode, isActive: true });

        if (offer && offer.discount) {
            // Check if coupon exists in Stripe by name (for simplicity)
            // In a production app, you might store stripe coupon IDs in your DB
            const existingCoupons = await stripe.coupons.list({ limit: 100 });
            let coupon = existingCoupons.data.find(c => c.name === couponCode);

            if (!coupon) {
                 coupon = await stripe.coupons.create({
                    percent_off: offer.discount,
                    duration: 'once',
                    name: couponCode,
                });
            }
            stripeCouponId = coupon.id;
        }
    }

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
        const sessionParams: Stripe.Checkout.SessionCreateParams = {
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
                }))),
                couponCode: couponCode || ''
            }
        };

        if (stripeCouponId) {
            sessionParams.discounts = [{ coupon: stripeCouponId }];
        }

        const session = await stripe.checkout.sessions.create(sessionParams);

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
        const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['discounts'] });
        return session;
    } catch (error) {
        console.error("Error retrieving session: ", error);
        return null;
    }
}
