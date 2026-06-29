import type { Metadata } from 'next';
import { storeInfo } from '@/lib/store-info';
import { StaticPageHero } from '@/components/layout/StaticPageHero';
import { StaticPageSection } from '@/components/layout/StaticPageSection';
import { PageCta } from '@/components/layout/PageCta';

export const metadata: Metadata = {
  title: `Terms of Service | ${storeInfo.name}`,
  description: `The terms and conditions that govern your use of ${storeInfo.name} and your purchases.`,
};

const lastUpdated = 'January 2026';

const sections = [
  {
    title: 'Acceptance of terms',
    content:
      'By accessing this website and placing an order, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website or services.',
  },
  {
    title: 'Products and availability',
    content:
      'We sell fresh produce and grocery items. As our stock depends on seasonal supply, availability may change without notice. We make every effort to display accurate prices and descriptions, but errors may occasionally occur, and we reserve the right to correct them.',
  },
  {
    title: 'Orders and pricing',
    content:
      'All prices are listed in New Zealand Dollars (NZD) and include GST where applicable. When you place an order, you will receive a confirmation. We reserve the right to refuse or cancel any order, for example where an item is out of stock or a pricing error is identified.',
  },
  {
    title: 'Payment',
    content:
      'Payment is taken at checkout through our secure payment provider, Stripe. By submitting payment details you confirm that you are authorised to use the chosen payment method.',
  },
  {
    title: 'Delivery',
    content:
      'We deliver to the areas listed at checkout. Estimated delivery times are provided in good faith but are not guaranteed. Please ensure someone is available to receive perishable goods. See our Shipping Policy for full details.',
  },
  {
    title: 'Cancellations and refunds',
    content:
      'You may amend or cancel an order before it has been dispatched. Once produce is on its way or delivered, our Refund Policy applies. We handle quality issues fairly and promptly.',
  },
  {
    title: 'Your account',
    content:
      'You are responsible for keeping your account credentials confidential and for all activity under your account. Notify us immediately if you suspect any unauthorised use.',
  },
  {
    title: 'Limitation of liability',
    content:
      'To the extent permitted by law, and without limiting your rights under the Consumer Guarantees Act 1993, we are not liable for indirect or consequential loss arising from the use of our website or products.',
  },
  {
    title: 'Changes to these terms',
    content:
      'We may update these terms from time to time. Continued use of the website after changes are posted constitutes acceptance of the updated terms.',
  },
  {
    title: 'Contact us',
    content: `Questions about these terms? Email us at ${storeInfo.email} or call ${storeInfo.phone}.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-0">
      <StaticPageHero
        eyebrow="Terms of service"
        title="Terms & conditions"
        description="Please read these terms carefully — they govern your use of our website and your purchases."
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
      </StaticPageSection>

      <StaticPageSection variant="muted">
        <PageCta
          title="Need clarification?"
          description="Our team is happy to walk you through anything in our terms."
          primaryHref="/contact"
          primaryLabel="Contact us"
          secondaryHref="/faq"
          secondaryLabel="View FAQs"
        />
      </StaticPageSection>
    </div>
  );
}
