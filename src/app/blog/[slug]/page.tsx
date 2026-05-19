import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { storeInfo } from '@/lib/store-info';
import { blogPosts } from '@/lib/static-pages-content';
import { StaticPageHero } from '@/components/layout/StaticPageHero';
import { StaticPageSection } from '@/components/layout/StaticPageSection';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type BlogPostPageProps = {
  params: { slug: string };
};

function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: `Blog | ${storeInfo.name}` };
  return {
    title: `${post.title} | ${storeInfo.name}`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const formattedDate = new Date(post.date).toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className="min-h-0">
      <StaticPageHero
        eyebrow="Blog"
        title={post.title}
        description={`${formattedDate} · ${post.readTime}`}
      />

      <StaticPageSection narrow>
        <Button asChild variant="ghost" className="mb-6 -ml-2 rounded-xl">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to blog
          </Link>
        </Button>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
          <p className="mt-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Full articles are coming soon. In the meantime, explore our shop for seasonal fruit and vegetables
            delivered across Nelson and Tasman.
          </p>
        </div>

        <div className="mt-10">
          <Button asChild className="rounded-xl w-full sm:w-auto">
            <Link href="/products">Shop fresh produce</Link>
          </Button>
        </div>
      </StaticPageSection>
    </article>
  );
}
