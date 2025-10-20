
'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function CheckoutCancelPage() {

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <XCircle className="mx-auto h-24 w-24 text-destructive" />
      <h1 className="mt-6 text-3xl font-bold font-headline">Payment Canceled</h1>
      <p className="mt-2 text-muted-foreground">
        Your payment was not completed. Your cart has been saved if you'd like to try again.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Button asChild>
          <Link href="/cart">Return to Cart</Link>
        </Button>
      </div>
    </div>
  );
}
