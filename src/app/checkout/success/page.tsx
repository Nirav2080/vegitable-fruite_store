
'use client'

import { useEffect, Suspense, useState } from 'react';
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
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let processed = false;
    if (sessionId && !processed) {
      processed = true; // Prevents re-running
      
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
             console.error("Session not complete or missing data", session);
             setError("There was a problem confirming your payment. Please contact support.");
             setIsProcessing(false);
          }
        } catch (error) {
           console.error("Failed to process order:", error);
           setError("Failed to process your order. Please contact support.");
           setIsProcessing(false);
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
