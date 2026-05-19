import type { Metadata } from 'next';
import { storeInfo } from '@/lib/store-info';
import { ContactForm } from './_components/ContactForm';
import { StaticPageHero } from '@/components/layout/StaticPageHero';
import { StaticPageSection } from '@/components/layout/StaticPageSection';
import { StoreInfoCard } from '@/components/layout/StoreInfoCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: `Contact Us | ${storeInfo.name}`,
  description: `Get in touch with ${storeInfo.name}. Questions about orders, delivery, or products — we are here to help.`,
};

export default function ContactPage() {
  return (
    <div className="min-h-0">
      <StaticPageHero
        eyebrow="Contact us"
        title="We would love to hear from you"
        description="Have a question about an order, delivery area, or product? Send us a message and our team will respond as soon as we can."
      />

      <StaticPageSection>
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <StoreInfoCard />
          </div>
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Card className="rounded-2xl border-border/30">
              <CardHeader className="space-y-1">
                <CardTitle className="text-lg sm:text-xl">Send a message</CardTitle>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Fill in the form below and we will reply to your email within 1–2 business days.
                </p>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </StaticPageSection>
    </div>
  );
}

