import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface PageCtaProps {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function PageCta({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: PageCtaProps) {
  return (
    <div className="text-center px-2">
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl text-balance">{title}</h2>
      <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center max-w-sm sm:max-w-none mx-auto">
        <Button asChild size="lg" className="rounded-xl w-full sm:w-auto">
          <Link href={primaryHref}>
            {primaryLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        {secondaryHref && secondaryLabel && (
          <Button asChild variant="outline" size="lg" className="rounded-xl w-full sm:w-auto">
            <Link href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

