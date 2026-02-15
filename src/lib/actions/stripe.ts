
'use server'

import Stripe from 'stripe';
import { headers } from 'next/headers';
import type { CartItem, Offer } from '@/lib/types';
import clientPromise from '@/lib/db';

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

export async function createCheckoutSession(cartItems: CartItem[], couponCode: string | null, userId: string) {
    const host = headers().get('origin') || 'http://localhost:9002';
    
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
    
    let calculatedDiscount = 0;
    if (couponCode) {
        const db = await getDb();
        if (!db) throw new Error("Database not connected for coupon validation");
        const offersCollection = db.collection<Offer>('offers');
        const offer = await offersCollection.findOne({ code: couponCode, isActive: true });

        if (offer && offer.discountValue > 0) {
            const subtotal = cartItems.reduce((acc, item) => acc + item.selectedVariant.price * item.quantity, 0);
            
            if (offer.scope === 'cart') {
                if (offer.discountType === 'percentage') {
                    calculatedDiscount = (subtotal * offer.discountValue) / 100;
                } else { // fixed
                    calculatedDiscount = offer.discountValue;
                }
            } else if (offer.scope === 'product' && offer.applicableProductIds) {
                 calculatedDiscount = cartItems.reduce((acc, item) => {
                    const productId = item.id.split('_')[0];
                    if (offer.applicableProductIds?.includes(productId)) {
                        if (offer.discountType === 'percentage') {
                            return acc + (item.selectedVariant.price * item.quantity * offer.discountValue) / 100;
                        } else {
                            return acc + (offer.discountValue * item.quantity);
                        }
                    }
                    return acc;
                }, 0);
            }
            
            calculatedDiscount = Math.min(calculatedDiscount, subtotal);
        }
    }


    const sessionParams: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${host}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${host}/checkout/cancel`,
        client_reference_id: userId,
        metadata: {
             cart: JSON.stringify(cartItems.map(item => ({
                p: item.id.split('_')[0],
                q: item.quantity,
                pr: item.selectedVariant.price,
                w: item.selectedVariant.weight
            }))),
            ...(couponCode && { couponCode: couponCode })
        }
    };
    
    if (calculatedDiscount > 0.01) {
        try {
            const coupon = await stripe.coupons.create({
                amount_off: Math.round(calculatedDiscount * 100),
                currency: 'nzd',
                duration: 'once',
                name: `Discount`
            });
            sessionParams.discounts = [{ coupon: coupon.id }];
        } catch (error: any) {
            console.error("Stripe coupon creation failed:", error.message);
            // This will stop the checkout if coupon creation fails
            throw new Error('Could not create a discount coupon for the checkout session.');
        }
    }


    try {
        const session = await stripe.checkout.sessions.create(sessionParams);

        if (session.id) {
            return { sessionId: session.id };
        } else {
            throw new Error('Failed to create Stripe checkout session');
        }
    } catch (error: any) {
        console.error("Stripe session creation failed:", error.message);
        throw new Error('Could not create checkout session.');
    }
}

export async function retrieveCheckoutSession(sessionId: string) {
    if (!sessionId) {
        return null;
    }
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        return session;
    } catch (error: any) {
        console.error(`Failed to retrieve Stripe session ${sessionId}:`, error.message);
        return null;
    }
}
