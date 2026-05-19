import type { Metadata } from 'next';
import Link from 'next/link';
import { storeInfo } from '@/lib/store-info';
import { StaticPageHero } from '@/components/layout/StaticPageHero';
import { StaticPageSection } from '@/components/layout/StaticPageSection';
import { PageCta } from '@/components/layout/PageCta';
import { FaqList } from './_components/FaqList';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: `FAQs | ${storeInfo.name}`,
  description: `Frequently asked questions about ordering, delivery, payments, and fresh produce from ${storeInfo.name}.`,
};

export default function FaqPage() {
  return (
    <div className="min-h-0">
      <StaticPageHero
        eyebrow="FAQs"
        title="Frequently asked questions"
        description="Quick answers about ordering, delivery, payments, and our fresh produce. Can’t find what you need? We’re happy to help."
      />

      <StaticPageSection narrow>
        <FaqList />
        <div className="mt-8 sm:mt-10 text-center">
          <p className="text-sm text-muted-foreground mb-4">Still have a question?</p>
          <Button asChild className="rounded-xl w-full sm:w-auto">
            <Link href="/contact">Contact support</Link>
          </Button>
        </div>
      </StaticPageSection>

      <StaticPageSection variant="muted">
        <PageCta
          title="Start shopping"
          description="Browse seasonal fruit, vegetables, and more — delivered to your door."
          primaryHref="/products"
          primaryLabel="Shop now"
        />
      </StaticPageSection>
    </div>
  );
}

