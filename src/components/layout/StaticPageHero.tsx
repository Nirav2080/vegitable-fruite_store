import { cn } from '@/lib/utils';

interface StaticPageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
}

export function StaticPageHero({ eyebrow, title, description, className }: StaticPageHeroProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden border-b border-border/30 bg-secondary/30',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-32 -top-32 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-2 sm:mb-3">
          {eyebrow}
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl max-w-3xl text-balance">
          {title}
        </h1>
        <p className="mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
}


