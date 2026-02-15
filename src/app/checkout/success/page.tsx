
'use client'

import { useEffect, Suspense, useState, useRef } from 'react';
import { useCart } from '@/hooks/use-cart';
import { useRouter, useSearchParams } from 'next/navigation';
import { retrieveCheckoutSession } from '@/lib/actions/stripe';
import { createOrder } from '@/lib/actions/orders';
import { Loader2 } from 'lucide-react';
import type Stripe from 'stripe';

function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [error, setError] = useState<string | null>(null);
  
  // Use a ref to ensure the processing logic runs only once.
  const isProcessing = useRef(false);

  useEffect(() => {
    if (sessionId && !isProcessing.current) {
      isProcessing.current = true; // Mark as processing immediately.
      
      const processOrder = async () => {
        try {
          const session = await retrieveCheckoutSession(sessionId);
          
          if (session && session.status === 'complete' && session.client_reference_id && session.metadata?.cartItems && session.customer_details?.email) {
            
            const discountAmountFromMeta = session.metadata?.discountAmount ? parseFloat(session.metadata.discountAmount) * 100 : 0;
            const discountAmountFromStripe = session.total_details?.amount_discount || 0;
            const totalDiscount = discountAmountFromMeta + discountAmountFromStripe;

            const discountInfo = {
                amount: totalDiscount,
                code: session.metadata?.couponCode || undefined,
            };

            const newOrder = await createOrder(
              session.id,
              session.client_reference_id,
              JSON.parse(session.metadata.cartItems),
              session.amount_total!,
              session.customer_details.email,
              discountInfo
            );

            clearCart();
            router.replace(`/order/${newOrder.id}`);
          } else {
             console.error("Session not complete or missing data", session);
             setError("There was a problem confirming your payment. Please contact support.");
          }
        } catch (error) {
           console.error("Failed to process order:", error);
           setError("Failed to process your order. Please contact support.");
        }
      };

      processOrder();
    } else if (!sessionId) {
        // If there's no session ID, redirect away.
        router.replace('/');
    }
  }, [sessionId, clearCart, router]);

  if (error) {
     return (
        <div className="container mx-auto px-4 py-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <h1 className="mt-6 text-3xl font-bold font-headline text-destructive">Order Processing Failed</h1>
            <p className="mt-2 text-muted-foreground">{error}</p>
        </div>
     )
  }

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
