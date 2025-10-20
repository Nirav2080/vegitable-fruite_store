
'use client'

import { useEffect, Suspense } from 'react';
import { useCart } from '@/hooks/use-cart';
import { useRouter, useSearchParams } from 'next/navigation';
import { retrieveCheckoutSession } from '@/lib/actions/stripe';
import { createOrder } from '@/lib/actions/orders';
import { Loader2 } from 'lucide-react';

function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      const processOrder = async () => {
        try {
          const session = await retrieveCheckoutSession(sessionId);
          
          if (session && session.status === 'complete' && session.client_reference_id && session.metadata?.cartItems && session.customer_details?.email) {
            const cartItems = JSON.parse(session.metadata.cartItems);
            const newOrder = await createOrder(
              session.client_reference_id,
              cartItems,
              session.amount_total!,
              session.customer_details.email
            );

            clearCart();
            router.replace(`/order/${newOrder.id}`);
          } else {
             // Handle case where session is not complete or data is missing
             console.error("Session not complete or missing data", session);
             router.replace('/cart'); // Redirect to cart if something is wrong
          }
        } catch (error) {
           console.error("Failed to process order:", error);
           router.replace('/cart');
        }
      };

      processOrder();
    } else {
        // If there's no session ID, redirect away.
        router.replace('/');
    }
  }, [sessionId, clearCart, router]);

  return (
    <div className="container mx-auto px-4 py-12 text-center flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" />
      <h1 className="mt-6 text-3xl font-bold font-headline">Processing your order...</h1>
      <p className="mt-2 text-muted-foreground">
        Please wait while we confirm your payment and create your order. Do not close this page.
      </p>
    </div>
  );
}


export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    )
}
