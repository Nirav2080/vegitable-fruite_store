
'use client'

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { retrieveCheckoutSession } from '@/lib/actions/stripe';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Optional: verify session on server, e.g. to save order details.
      retrieveCheckoutSession(sessionId).then(session => {
        if (session && session.status === 'complete') {
          console.log("Payment successful for session:", sessionId);
        }
      });
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <CheckCircle className="mx-auto h-24 w-24 text-green-500" />
      <h1 className="mt-6 text-3xl font-bold font-headline">Payment Successful!</h1>
      <p className="mt-2 text-muted-foreground">
        Thank you for your order. We've received your payment and will start processing your order shortly.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/account/orders">View My Orders</Link>
        </Button>
      </div>
    </div>
  );
}
