import type { Metadata } from 'next';
import { storeInfo } from '@/lib/store-info';
import { StaticPageHero } from '@/components/layout/StaticPageHero';
import { StaticPageSection } from '@/components/layout/StaticPageSection';
import { PageCta } from '@/components/layout/PageCta';
import { Leaf, Heart, Truck, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: `About Us | ${storeInfo.name}`,
  description: `Learn about ${storeInfo.name} — fresh, locally sourced produce delivered across Nelson and Tasman.`,
};

const values = [
  {
    icon: Leaf,
    title: 'Farm-fresh quality',
    description:
      'We work with trusted local growers to bring you produce at its peak — crisp, colourful, and full of flavour.',
  },
  {
    icon: Heart,
    title: 'Family-first service',
    description:
      'From your first order to your hundredth, we treat every customer like a neighbour stopping by the market.',
  },
  {
    icon: Truck,
    title: 'Fast local delivery',
    description:
      'Orders over $50 qualify for free delivery, with most Richmond and Nelson areas reached within a few hours.',
  },
  {
    icon: Users,
    title: 'Community roots',
    description:
      'Proudly serving the Top of the South — supporting local farms and healthy tables across our region.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-0">
      <StaticPageHero
        eyebrow="About us"
        title="Fresh produce, picked with care"
        description={`${storeInfo.name} is your neighbourhood source for quality fruits, vegetables, and pantry staples — delivered from our team to your door across Nelson and Tasman.`}
      />

      <StaticPageSection>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start lg:items-center">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">Our story</h2>
            <div className="mt-5 sm:mt-6 space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              <p>
                What started as a small market stall in Richmond has grown into a full online store — without losing
                the personal touch of a local greengrocer. We still hand-select produce each morning, check every
                order before it leaves, and pack with the same care we would for our own families.
              </p>
              <p>
                Whether you are stocking up for the week, planning a special meal, or looking for organic options,
                we make it simple to shop fresh food online with confidence.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-border/30 bg-card p-6 sm:p-8 lg:p-10">
            <h3 className="font-semibold text-base sm:text-lg mb-4">At a glance</h3>
            <ul className="space-y-4 text-sm">
              {[
                { label: 'Founded', value: 'Richmond, Nelson' },
                { label: 'Currency', value: 'New Zealand Dollar (NZD)' },
                { label: 'Delivery', value: 'Free over $50 · 2–4 hours' },
                { label: 'Range', value: 'Fruits, vegetables, herbs & more' },
              ].map((row) => (
                <li
                  key={row.label}
                  className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4 border-b border-border/30 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium sm:text-right">{row.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </StaticPageSection>

      <StaticPageSection variant="muted">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-2">What we stand for</p>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">Why customers choose us</h2>
        </div>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border/30 bg-card p-5 sm:p-6 text-center transition-all duration-300 hover:shadow-lg hover:shadow-black/[0.03] hover:-translate-y-0.5"
            >
              <div className="mx-auto mb-4 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base">{item.title}</h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </StaticPageSection>

      <StaticPageSection>
        <PageCta
          title="Ready to fill your basket?"
          description="Browse our full range of seasonal produce and weekly specials."
          primaryHref="/products"
          primaryLabel="Shop now"
          secondaryHref="/contact"
          secondaryLabel="Contact us"
        />
      </StaticPageSection>
    </div>
  );
}

