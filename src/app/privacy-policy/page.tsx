import type { Metadata } from 'next';
import { storeInfo } from '@/lib/store-info';
import { StaticPageHero } from '@/components/layout/StaticPageHero';
import { StaticPageSection } from '@/components/layout/StaticPageSection';
import { PageCta } from '@/components/layout/PageCta';

export const metadata: Metadata = {
  title: `Privacy Policy | ${storeInfo.name}`,
  description: `How ${storeInfo.name} collects, uses, and protects your personal information.`,
};

const lastUpdated = 'January 2026';

const sections = [
  {
    title: 'Information we collect',
    content:
      'We collect the information you provide when you create an account, place an order, or contact us — including your name, email address, phone number, delivery address, and order history. Payments are processed securely by Stripe; we never see or store your full card details.',
  },
  {
    title: 'How we use your information',
    content:
      'Your information is used to process and deliver your orders, manage your account, respond to enquiries, send order updates, and — only with your consent — share occasional offers. We do not sell your personal data to third parties.',
  },
  {
    title: 'Payment processing',
    content:
      'All card payments are handled by Stripe, a PCI-DSS compliant payment processor. Card data is transmitted directly to Stripe over an encrypted connection and is never stored on our servers.',
  },
  {
    title: 'Cookies and tracking',
    content:
      'We use essential cookies to keep you signed in and to remember your cart. You can read more in our Cookie Policy. You may disable non-essential cookies through your browser settings at any time.',
  },
  {
    title: 'Data security',
    content:
      'We protect your account with hashed passwords and secure, signed sessions, and we serve the site over encrypted HTTPS connections. While no system is completely secure, we take reasonable technical and organisational measures to safeguard your data.',
  },
  {
    title: 'Your rights',
    content:
      'Under the New Zealand Privacy Act 2020, you have the right to access the personal information we hold about you and to request correction of anything inaccurate. To make a request, contact us using the details below.',
  },
  {
    title: 'Data retention',
    content:
      'We keep your information for as long as your account is active or as needed to provide our services and meet legal obligations. You can request deletion of your account and associated data at any time.',
  },
  {
    title: 'Contact us',
    content: `If you have any questions about this policy or your personal information, email us at ${storeInfo.email} or write to us at ${storeInfo.address.line1}, ${storeInfo.address.suburb}, ${storeInfo.address.city} ${storeInfo.address.postcode}, ${storeInfo.address.country}.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-0">
      <StaticPageHero
        eyebrow="Privacy policy"
        title="Your privacy matters to us"
        description="We're committed to protecting your personal information and being transparent about how we use it."
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
          title="Have a question about your data?"
          description="Reach out and we'll be happy to help clarify anything."
          primaryHref="/contact"
          primaryLabel="Contact us"
          secondaryHref="/faq"
          secondaryLabel="View FAQs"
        />
      </StaticPageSection>
    </div>
  );
}
