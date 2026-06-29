import type { Metadata } from 'next';
import { storeInfo } from '@/lib/store-info';
import { StaticPageHero } from '@/components/layout/StaticPageHero';
import { StaticPageSection } from '@/components/layout/StaticPageSection';
import { PageCta } from '@/components/layout/PageCta';

export const metadata: Metadata = {
  title: `Cookie Policy | ${storeInfo.name}`,
  description: `How ${storeInfo.name} uses cookies and similar technologies, and how you can control them.`,
};

const lastUpdated = 'January 2026';

const sections = [
  {
    title: 'What are cookies?',
    content:
      'Cookies are small text files stored on your device when you visit a website. They help the site remember your actions and preferences — such as keeping you signed in or remembering the items in your cart — so you don’t have to re-enter them on every visit.',
  },
  {
    title: 'Essential cookies',
    content:
      'These are required for the website to function. They keep your shopping cart, remember your login session, and secure your account. The site cannot work properly without them, so they cannot be switched off.',
  },
  {
    title: 'Preference cookies',
    content:
      'These remember choices you make, such as your light or dark theme preference, to give you a more personalised experience.',
  },
  {
    title: 'Analytics cookies',
    content:
      'Where used, these help us understand how visitors interact with the site so we can improve it. They collect information in an aggregated, anonymous form.',
  },
  {
    title: 'Managing cookies',
    content:
      'You can control and delete cookies through your browser settings. Please note that blocking essential cookies may prevent parts of the website — such as checkout — from working correctly.',
  },
  {
    title: 'Questions',
    content: `If you have any questions about how we use cookies, please get in touch at ${storeInfo.email}.`,
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="min-h-0">
      <StaticPageHero
        eyebrow="Cookie policy"
        title="How we use cookies"
        description="A clear explanation of the cookies we use and how you can stay in control."
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
          title="Want to know more about your privacy?"
          description="Read our full Privacy Policy to see how we handle your data."
          primaryHref="/privacy-policy"
          primaryLabel="Privacy Policy"
          secondaryHref="/contact"
          secondaryLabel="Contact us"
        />
      </StaticPageSection>
    </div>
  );
}
