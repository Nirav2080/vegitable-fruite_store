import type { Metadata } from 'next';
import Link from 'next/link';
import { storeInfo } from '@/lib/store-info';
import { StaticPageHero } from '@/components/layout/StaticPageHero';
import { StaticPageSection } from '@/components/layout/StaticPageSection';
import { PageCta } from '@/components/layout/PageCta';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Mail, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: `Gift Cards | ${storeInfo.name}`,
  description: `Give the gift of fresh produce with ${storeInfo.name} gift cards.`,
};

const steps = [
  {
    icon: Gift,
    title: 'Choose an amount',
    description: 'Select a value that suits the occasion — perfect for birthdays, thank-yous, or everyday groceries.',
  },
  {
    icon: Mail,
    title: 'We prepare your card',
    description: 'Digital gift cards are sent by email with a unique code to use at checkout on our online store.',
  },
  {
    icon: Sparkles,
    title: 'They shop fresh',
    description: 'Recipients browse our full range of fruit, vegetables, and more — delivered across Nelson and Tasman.',
  },
];

export default function GiftCardsPage() {
  return (
    <div className="min-h-0">
      <StaticPageHero
        eyebrow="Gift cards"
        title="Give the gift of fresh food"
        description="Share healthy, locally sourced produce with friends and family. Gift cards are available on request — contact us to purchase."
      />

      <StaticPageSection>
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.title} className="rounded-2xl border-border/30">
              <CardContent className="pt-6 sm:pt-8 text-center">
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base">{step.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-2xl border-border/30 mt-8 sm:mt-10 bg-primary/5">
          <CardContent className="py-6 sm:py-8 text-center px-4 sm:px-6">
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Gift cards are issued manually while we roll out online purchasing. Email us with the amount and
              recipient details, and we will send payment instructions and the gift code.
            </p>
            <Button asChild className="mt-6 rounded-xl w-full sm:w-auto">
              <Link href="/contact">Request a gift card</Link>
            </Button>
          </CardContent>
        </Card>
      </StaticPageSection>

      <StaticPageSection variant="muted">
        <PageCta
          title="Prefer to shop now?"
          description="Explore our seasonal produce and add items straight to your cart."
          primaryHref="/products"
          primaryLabel="Browse shop"
        />
      </StaticPageSection>
    </div>
  );
}
