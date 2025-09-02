
'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbLink {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    links: BreadcrumbLink[];
    className?: string;
}

export function Breadcrumbs({ links, className }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={cn("text-sm text-muted-foreground", className)}>
            <ol className="flex items-center gap-1.5">
                {links.map((link, index) => (
                    <li key={index} className="flex items-center gap-1.5">
                        {index > 0 && <ChevronRight className="h-4 w-4" />}
                        {link.href ? (
                            <Link href={link.href} className="hover:text-primary transition-colors">
                                {link.label}
                            </Link>
                        ) : (
                            <span className="font-medium text-foreground">{link.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
