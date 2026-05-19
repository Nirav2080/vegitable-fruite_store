import type { Metadata } from 'next';
import Link from 'next/link';
import { storeInfo } from '@/lib/store-info';
import { StaticPageHero } from '@/components/layout/StaticPageHero';
import { StaticPageSection } from '@/components/layout/StaticPageSection';
import { StoreInfoCard } from '@/components/layout/StoreInfoCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Truck, RotateCcw, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: `Support | ${storeInfo.name}`,
  description: `Get help with orders, delivery, and returns at ${storeInfo.name}.`,
};

const supportTopics = [
  {
    icon: Package,
    title: 'Orders & tracking',
    description: 'Questions about your order status, items, or changes before delivery.',
    href: '/contact',
    linkLabel: 'Contact us',
  },
  {
    icon: Truck,
    title: 'Delivery',
    description: 'Delivery areas, timing, fees, and free delivery on orders over $50.',
    href: '/faq',
    linkLabel: 'View FAQs',
  },
  {
    icon: RotateCcw,
    title: 'Returns & refunds',
    description: 'Quality issues or missing items — see our refund policy for details.',
    href: '/refund-policy',
    linkLabel: 'Refund policy',
  },
  {
    icon: MessageCircle,
    title: 'General enquiries',
    description: 'Product availability, gift cards, or feedback — send us a message.',
    href: '/contact',
    linkLabel: 'Send a message',
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-0">
      <StaticPageHero
        eyebrow="Support"
        title="How can we help?"
        description="Find answers fast or reach our team for order and delivery support."
      />

      <StaticPageSection>
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
          <div className="lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {supportTopics.map((topic) => (
                <Card key={topic.title} className="rounded-2xl border-border/30 flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
                      <topic.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{topic.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1 gap-4">
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{topic.description}</p>
                    <Button asChild variant="link" className="p-0 h-auto justify-start text-primary">
                      <Link href={topic.href}>{topic.linkLabel}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <StoreInfoCard />
          </div>
        </div>
      </StaticPageSection>
    </div>
  );
}

