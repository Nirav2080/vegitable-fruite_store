import type { Metadata } from 'next';
import Link from 'next/link';
import { storeInfo } from '@/lib/store-info';
import { StaticPageHero } from '@/components/layout/StaticPageHero';
import { StaticPageSection } from '@/components/layout/StaticPageSection';
import { PageCta } from '@/components/layout/PageCta';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: `Shipping Policy | ${storeInfo.name}`,
  description: `Delivery areas, timings, costs, and how ${storeInfo.name} keeps your fresh produce in great condition.`,
};

const lastUpdated = 'January 2026';

const sections = [
  {
    title: 'Delivery areas',
    content:
      'We currently deliver across the Nelson and Tasman regions. Available delivery zones and timeslots are shown at checkout once you enter your address.',
  },
  {
    title: 'Delivery times',
    content:
      'Orders placed before the daily cut-off are typically delivered within 2–4 hours where same-day delivery is available, or on your chosen scheduled date. Estimated times are provided in good faith but may vary with demand and weather.',
  },
  {
    title: 'Delivery charges',
    content:
      'Delivery is free on orders over $50. For orders below that threshold, a small delivery fee is calculated and displayed at checkout before you pay.',
  },
  {
    title: 'Keeping produce fresh',
    content:
      'Your fruit and vegetables are packed with care to maintain freshness in transit. For perishable items, please ensure someone is available to receive the order, or provide a safe, shaded drop-off location.',
  },
  {
    title: 'Missed deliveries',
    content:
      'If we are unable to complete your delivery and no safe drop-off is available, we will contact you to arrange a redelivery. Additional charges may apply for repeated missed deliveries.',
  },
  {
    title: 'Problems with your delivery',
    content:
      'If your order arrives late, incomplete, or not in perfect condition, please contact us within 24 hours so we can put it right. See our Refund Policy for how quality issues are handled.',
  },
];

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-0">
      <StaticPageHero
        eyebrow="Shipping policy"
        title="Fresh produce, delivered with care"
        description="Everything you need to know about how, when, and where we deliver your order."
      />

      <StaticPageSection narrow>
        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-8">
          Last updated: {lastUpdated}
        </p>
        <div className="space-y-8 sm:space-y-10">
          {sections.map((section) => (
            <article key={section.title}>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight">{section.title}</h2>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {section.content}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-10 sm:mt-12 rounded-2xl border border-border/30 bg-card p-6 sm:p-8 text-center">
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            Ready to get fresh produce delivered?
          </p>
          <Button asChild className="rounded-xl w-full sm:w-auto">
            <Link href="/products">Start shopping</Link>
          </Button>
        </div>
      </StaticPageSection>

      <StaticPageSection variant="muted">
        <PageCta
          title="Questions about delivery?"
          description="Check our FAQs or reach out — we're happy to help."
          primaryHref="/faq"
          primaryLabel="View FAQs"
          secondaryHref="/contact"
          secondaryLabel="Contact us"
        />
      </StaticPageSection>
    </div>
  );
}
