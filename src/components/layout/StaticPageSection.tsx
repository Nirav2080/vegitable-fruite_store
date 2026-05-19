import { cn } from '@/lib/utils';

interface StaticPageSectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'muted';
  narrow?: boolean;
}

export function StaticPageSection({
  children,
  className,
  variant = 'default',
  narrow = false,
}: StaticPageSectionProps) {
  return (
    <section
      className={cn(
        'py-12 sm:py-16 md:py-20',
        variant === 'muted' && 'bg-secondary/20 border-y border-border/30',
        className
      )}
    >
      <div
        className={cn(
          'mx-auto px-4 sm:px-6 lg:px-8',
          narrow ? 'max-w-3xl' : 'max-w-7xl'
        )}
      >
        {children}
      </div>
    </section>
  );
}

