
'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function CheckoutCancelPage() {

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight font-headline">Payment Canceled</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Your payment was not completed. Your cart has been saved if you&apos;d like to try again.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild className="rounded-full shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30">
            <Link href="/cart">Return to Cart</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
