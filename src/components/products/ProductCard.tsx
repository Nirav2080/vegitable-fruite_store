
'use client'

import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/use-wishlist";

interface ProductCardProps {
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

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const defaultVariant = product.variants?.[0];
  if (!defaultVariant) {
    return null; 
  }

  const images = Array.isArray(product.images) ? product.images : [product.images];
  const primaryImage = images[0] || 'https://placehold.co/400x400/EEE/31343C?text=No+Image';
  
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, defaultVariant);
  }

  const handleWishlistClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  }

  const onWishlist = isClient && isInWishlist(product.id);
  
  return (
    <div 
        className="flex flex-col h-full overflow-hidden group transition-all duration-300"
    >
      <div className="relative overflow-hidden p-4 bg-secondary rounded-lg">
        <Link href={`/products/${product.slug}`} className="block aspect-square relative">
          <Image
            src={primaryImage}
            alt={product.name}
            data-ai-hint="product image"
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md"
            onClick={handleWishlistClick}
            aria-label="Add to wishlist"
        >
            <Heart className={cn("h-4 w-4", onWishlist && "text-red-500 fill-red-500")} />
        </Button>
      </div>
      <div className="pt-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start">
            <h3 className="text-base font-medium leading-tight flex-grow pr-2">
                <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
                    {product.name}
                </Link>
            </h3>
            <p className="text-base font-semibold text-primary">${defaultVariant.price.toFixed(2)}</p>
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-2 mt-2">
            {renderStars(product.rating || 0)}
            <span className='text-xs text-muted-foreground'>({product.reviews?.length || 0})</span>
        </div>
         <Button variant="outline" size="sm" className="w-full mt-4 rounded-full" onClick={handleAddToCart} disabled={defaultVariant.stock === 0}>
            {defaultVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}
