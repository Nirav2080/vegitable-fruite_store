
'use client'

import { useEffect, Suspense, useState, useRef } from 'react';
import { useCart } from '@/hooks/use-cart';
import { useRouter, useSearchParams } from 'next/navigation';
import { retrieveCheckoutSession } from '@/lib/actions/stripe';
import { createOrder } from '@/lib/actions/orders';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [error, setError] = useState<string | null>(null);
  const isProcessing = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      router.replace('/');
      return;
    }

    if (isProcessing.current) return;
    isProcessing.current = true;

    const processOrder = async () => {
      try {
        const session = await retrieveCheckoutSession(sessionId);

        if (!session) {
          setError('Could not retrieve your payment session. Please contact support with your session ID.');
          return;
        }

        const isPaymentOk =
          session.payment_status === 'paid' || session.status === 'complete';
        const customerEmail =
          session.customer_details?.email ?? (session as any).customer_email ?? null;
        const cartMeta = session.metadata?.cart;
        const userId = session.client_reference_id;

        if (!isPaymentOk) {
          setError('Your payment has not been confirmed yet. If you were charged, please contact support.');
          return;
        }

        if (!userId || !cartMeta || !customerEmail) {
          console.error('Session missing data', { userId, cartMeta, customerEmail });
          setError('Payment succeeded but order data is incomplete. Please contact support.');
          return;
        }

        const discountInfo = {
          amount: session.total_details?.amount_discount || 0,
          code: session.metadata?.couponCode || undefined,
        };

        const newOrder = await createOrder(
          session.id,
          userId,
          JSON.parse(cartMeta),
          session.amount_total!,
          customerEmail,
          discountInfo,
        );

        clearCart();
        router.replace(`/order/${newOrder.id}`);
      } catch (err: any) {
        console.error('Failed to process order:', err);
        setError(err.message || 'Failed to process your order. Please contact support.');
      }
    };

    processOrder();
  }, [sessionId, clearCart, router]);

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center flex flex-col items-center justify-center min-h-[400px] sm:px-6 lg:px-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight font-headline text-destructive">Order Processing Failed</h1>
        <p className="mt-3 text-muted-foreground max-w-md leading-relaxed">{error}</p>
        {sessionId && (
          <p className="mt-4 text-xs text-muted-foreground">Session ID: {sessionId}</p>
        )}
        <Button asChild className="mt-8 rounded-full px-8 shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center flex flex-col items-center justify-center min-h-[400px] sm:px-6 lg:px-8">
      <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" />
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight font-headline">Processing your order...</h1>
      <p className="mt-3 text-muted-foreground leading-relaxed">
        Please wait while we confirm your payment and create your order. Do not close this page.
      </p>
    </div>
  );
}


export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8"><Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
