
'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function CheckoutCancelPage() {

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
          <XCircle className="h-7 w-7 text-destructive" />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight">Payment Canceled</h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Your payment was not completed. Your cart has been saved if you&apos;d like to try again.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild className="rounded-xl shadow-sm">
            <Link href="/cart">Return to Cart</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
