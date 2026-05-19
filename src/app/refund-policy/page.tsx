import type { Metadata } from 'next';
import Link from 'next/link';
import { storeInfo } from '@/lib/store-info';
import { StaticPageHero } from '@/components/layout/StaticPageHero';
import { StaticPageSection } from '@/components/layout/StaticPageSection';
import { PageCta } from '@/components/layout/PageCta';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: `Refund Policy | ${storeInfo.name}`,
  description: `Refund and return policy for ${storeInfo.name} — fresh produce orders, quality guarantees, and how to request a refund.`,
};

const policySections = [
  {
    title: 'Our quality promise',
    content:
      'We take pride in the freshness of every item we deliver. If something does not meet your expectations — damaged, spoiled, or missing from your order — please let us know within 24 hours of delivery.',
  },
  {
    title: 'Eligible refunds',
    content:
      'Refunds or replacements may be offered for: incorrect items, poor quality produce reported promptly with photos where possible, or items not received. We review each case individually and aim to resolve issues fairly.',
  },
  {
    title: 'Non-refundable items',
    content:
      'We cannot accept returns of perishable goods that have been stored incorrectly after delivery, or change-of-mind requests once produce has been accepted in good condition.',
  },
  {
    title: 'How to request a refund',
    content:
      'Contact us via the contact form or email with your order number, a brief description, and photos if applicable. Approved refunds are processed to your original payment method within 5–10 business days.',
  },
  {
    title: 'Delivery issues',
    content:
      'If your order arrived late or was left in an unsafe location, contact us immediately so we can investigate with our delivery team and find a suitable solution.',
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="min-h-0">
      <StaticPageHero
        eyebrow="Refund policy"
        title="Fair refunds for fresh produce"
        description="We stand behind the quality of our fruit and vegetables. Here is how refunds and replacements work."
      />

      <StaticPageSection narrow>
        <div className="space-y-8 sm:space-y-10">
          {policySections.map((section) => (
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
            Need help with a recent order?
          </p>
          <Button asChild className="rounded-xl w-full sm:w-auto">
            <Link href="/contact">Contact support</Link>
          </Button>
        </div>
      </StaticPageSection>

      <StaticPageSection variant="muted">
        <PageCta
          title="Questions before you order?"
          description="Read our FAQs or get in touch — we are here to help."
          primaryHref="/faq"
          primaryLabel="View FAQs"
          secondaryHref="/contact"
          secondaryLabel="Contact us"
        />
      </StaticPageSection>
    </div>
  );
}
