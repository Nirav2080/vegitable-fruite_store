import type { Metadata } from 'next';
import Link from 'next/link';
import { storeInfo } from '@/lib/store-info';
import { blogPosts } from '@/lib/static-pages-content';
import { StaticPageHero } from '@/components/layout/StaticPageHero';
import { StaticPageSection } from '@/components/layout/StaticPageSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: `Blog | ${storeInfo.name}`,
  description: `Tips, recipes, and seasonal produce guides from ${storeInfo.name}.`,
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BlogPage() {
  return (
    <div className="min-h-0">
      <StaticPageHero
        eyebrow="Blog"
        title="Fresh ideas & seasonal inspiration"
        description="Recipes, storage tips, and guides to what is in season across Nelson and Tasman."
      />

      <StaticPageSection>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card
              key={post.slug}
              className="rounded-2xl border-border/30 flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-black/[0.03] hover:-translate-y-0.5"
            >
              <div className="aspect-[16/10] bg-secondary/50 rounded-t-2xl flex items-center justify-center">
                <span className="text-4xl" aria-hidden>
                  🥬
                </span>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg leading-snug line-clamp-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 gap-4">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(post.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readTime}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </StaticPageSection>
    </div>
  );
}
