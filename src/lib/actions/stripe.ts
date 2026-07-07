
'use server'

import Stripe from 'stripe';
import { headers } from 'next/headers';
import type { CheckoutItem, Offer } from '@/lib/types';
import { getDatabase } from '@/lib/db';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getStripeInstance(): Stripe {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || key.startsWith('your_') || key.length < 20) {
        throw new Error(
            'Stripe secret key is missing or still set to the placeholder value. ' +
            'Please update STRIPE_SECRET_KEY in your .env file with a real key from https://dashboard.stripe.com/apikeys'
        );
    }
    return new Stripe(key, { apiVersion: '2024-06-20' });
}

async function getDb() {
    return getDatabase();
}

const isPlaceholderUrl = (url: string): boolean => {
    try {
        const hostname = new URL(url).hostname;
        return ['picsum.photos', 'placehold.co'].includes(hostname);
    } catch {
        return true;
    }
};

const isValidImageUrl = (url: string): boolean => {
    // Stripe has a 2048 character limit for URLs in requests
    // Image URLs should not exceed 1500 chars to leave room for other parameters
    return !!url && url.length <= 1500 && (url.startsWith('http://') || url.startsWith('https://'));
};

// ---------------------------------------------------------------------------
// Return types – never throw from server actions; return structured results.
// ---------------------------------------------------------------------------

type CheckoutResult =
    | { success: true; sessionId: string }
    | { success: false; error: string };

// ---------------------------------------------------------------------------
// createCheckoutSession
// ---------------------------------------------------------------------------

export async function createCheckoutSession(
    items: CheckoutItem[],
    couponCode: string | null,
    userId: string,
): Promise<CheckoutResult> {
    try {
        // ---- Validation ----
        if (!items || items.length === 0) {
            return { success: false, error: 'Your cart is empty.' };
        }
        if (!userId) {
            return { success: false, error: 'You must be logged in to checkout.' };
        }

        const stripe = getStripeInstance();
        const host = headers().get('origin') || headers().get('referer')?.replace(/\/checkout.*/, '') || 'http://localhost:3000';

        // ---- Build Stripe line‑items from the lightweight CheckoutItem[] ----
        // Stripe requires `quantity` to be a positive integer. Weight‑based
        // items carry a fractional quantity (e.g. 0.2 = 200g of a 1kg variant),
        // so for those we send quantity: 1 and fold the fractional amount into
        // the unit price, keeping the charged total exact (e.g. $5 × 0.2 = $1).
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
            const isWholeQuantity = Number.isInteger(item.quantity);

            const unitAmount = isWholeQuantity
                ? Math.round(item.price * 100)
                : Math.round(item.price * item.quantity * 100);
            const quantity = isWholeQuantity ? item.quantity : 1;

            const product_data: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.ProductData = {
                name: item.name,
                // For fractional (weight) items, show the actual amount in the description.
                description: isWholeQuantity ? item.weight : `${item.weight} × ${item.quantity}`,
            };

            if (item.image && !isPlaceholderUrl(item.image) && isValidImageUrl(item.image)) {
                product_data.images = [item.image];
            }

            return {
                price_data: {
                    currency: 'nzd',
                    product_data,
                    unit_amount: unitAmount,
                },
                quantity,
            };
        });

        // ---- Coupon / Discount calculation ----
        let calculatedDiscount = 0;

        if (couponCode) {
            const db = await getDb();
            if (db) {
                const offer = await db.collection<Offer>('offers').findOne({ code: couponCode, isActive: true });

                if (offer && offer.discountValue > 0) {
                    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

                    if (offer.scope === 'cart') {
                        calculatedDiscount =
                            offer.discountType === 'percentage'
                                ? (subtotal * offer.discountValue) / 100
                                : offer.discountValue;
                    } else if (offer.scope === 'product' && offer.applicableProductIds) {
                        calculatedDiscount = items.reduce((acc, i) => {
                            if (offer.applicableProductIds?.includes(i.productId)) {
                                return acc +
                                    (offer.discountType === 'percentage'
                                        ? (i.price * i.quantity * offer.discountValue) / 100
                                        : offer.discountValue * i.quantity);
                            }
                            return acc;
                        }, 0);
                    }

                    calculatedDiscount = Math.min(calculatedDiscount, subtotal);
                }
            }
        }

        // ---- Session metadata (compact cart snapshot for order creation later) ----
        const cartMeta = JSON.stringify(
            items.map((i) => ({
                p: i.productId,
                q: i.quantity,
                pr: i.price,
                w: i.weight,
            })),
        );

        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${host}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${host}/checkout/cancel`,
            client_reference_id: userId,
            metadata: {
                cart: cartMeta,
                ...(couponCode ? { couponCode } : {}),
            },
        };

        // Attach a one‑off Stripe coupon when there's a discount
        if (calculatedDiscount > 0.01) {
            try {
                const coupon = await stripe.coupons.create({
                    amount_off: Math.round(calculatedDiscount * 100),
                    currency: 'nzd',
                    duration: 'once',
                    name: `Discount: ${couponCode || 'General'}`,
                });
                sessionParams.discounts = [{ coupon: coupon.id }];
            } catch (err: any) {
                console.error('Stripe coupon creation failed:', err.message);
                // Non‑fatal: proceed without the discount
            }
        }

        // ---- Create session ----
        const session = await stripe.checkout.sessions.create(sessionParams);

        if (!session.id) {
            return { success: false, error: 'Stripe did not return a session ID.' };
        }

        return { success: true, sessionId: session.id };
    } catch (error: any) {
        console.error('createCheckoutSession error:', error);
        return {
            success: false,
            error: error.message || 'Could not create checkout session. Please try again.',
        };
    }
}

// ---------------------------------------------------------------------------
// retrieveCheckoutSession
// ---------------------------------------------------------------------------

export async function retrieveCheckoutSession(sessionId: string) {
    if (!sessionId) return null;
    try {
        const stripe = getStripeInstance();
        return await stripe.checkout.sessions.retrieve(sessionId);
    } catch (error: any) {
        console.error(`Failed to retrieve Stripe session ${sessionId}:`, error.message);
        return null;
    }
}
