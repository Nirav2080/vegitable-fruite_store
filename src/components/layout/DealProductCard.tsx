
'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CountdownTimer } from './CountdownTimer';

interface ClientOnlyCountdownProps {
  targetDate: string;
  size?: 'normal' | 'small';
}

function ClientOnlyCountdown({ targetDate, size }: ClientOnlyCountdownProps) {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <CountdownTimer targetDate={targetDate} size={size} /> : null;
}

interface DealProductCardProps {
    product: Product;
}

function renderStars(rating: number) {
    const totalStars = 5;
    const filledStars = Math.round(rating);
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(totalStars)].map((_, i) => (
                <Star
                    key={i}
                    className={cn(
                        'w-4 h-4',
                        i < filledStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    )}
                />
            ))}
        </div>
    );
}

export function DealProductCard({ product }: DealProductCardProps) {
    const defaultVariant = product.variants?.[0];
    if (!defaultVariant) {
        return null;
    }

    const images = Array.isArray(product.images) ? product.images : [product.images];
    const primaryImage = images[0] || 'https://placehold.co/400x400/EEE/31343C?text=No+Image';

    const discountPercentage = defaultVariant.originalPrice ? Math.round(((defaultVariant.originalPrice - defaultVariant.price) / defaultVariant.originalPrice) * 100) : 0;
    
    const isNew = () => {
        const today = new Date();
        const productDate = new Date(product.createdAt);
        const diffTime = Math.abs(today.getTime() - productDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    }

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + (parseInt(product.id.substring(0, 8), 16) % 5) + 1); // Random day between 1-5

    return (
        <div className="border rounded-lg p-4 flex gap-4 items-center bg-background/80 hover:shadow-md transition-shadow duration-300 h-full">
            <div className="relative w-1/3 aspect-square">
                 <Link href={`/products/${product.slug}`} className="block h-full w-full">
                    <Image
                        src={primaryImage}
                        alt={product.name}
                        fill
                        className="object-contain rounded-md"
                    />
                </Link>
                <div className="absolute top-1 left-1 flex flex-col gap-1">
                    {discountPercentage > 0 && <Badge variant="destructive" className="rounded-md">-{discountPercentage}%</Badge>}
                    {isNew() && <Badge className="bg-white text-black hover:bg-white/90 border border-gray-200 rounded-md">New</Badge>}
                </div>
            </div>
            <div className="w-2/3 flex flex-col gap-y-1.5">
                <h3 className="text-sm font-semibold leading-tight line-clamp-2">
                    <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
                        {product.name}
                    </Link>
                </h3>
                 <div className="flex items-center gap-2 text-xs">
                    {renderStars(product.rating || 0)}
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-primary">${defaultVariant.price.toFixed(2)}</p>
                    {defaultVariant.originalPrice && <p className="text-xs text-muted-foreground line-through">${defaultVariant.originalPrice.toFixed(2)}</p>}
                </div>
                <div className="text-xs text-muted-foreground">Available: {defaultVariant.stock}</div>
                <Progress value={(defaultVariant.stock / 100) * 100} className="h-1 bg-yellow-400/20 [&>div]:bg-yellow-400" />
                <ClientOnlyCountdown targetDate={targetDate.toISOString()} size="small" />
            </div>
        </div>
    );
}
