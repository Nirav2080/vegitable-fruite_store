
'use client'

import type { Product } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Heart } from "lucide-react";
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
    // Or render a placeholder, or return null if products without variants shouldn't be displayed
    return null; 
  }

  const images = Array.isArray(product.images) ? product.images : [product.images];
  const primaryImage = images[0] || 'https://placehold.co/400x400/EEE/31343C';
  
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
  const discountPercentage = defaultVariant.originalPrice ? Math.round(((defaultVariant.originalPrice - defaultVariant.price) / defaultVariant.originalPrice) * 100) : 0;
  
  const isNew = () => {
    const today = new Date();
    const productDate = new Date(product.createdAt);
    const diffTime = Math.abs(today.getTime() - productDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }
  
  return (
    <Card 
        className="flex flex-col h-full overflow-hidden group transition-all duration-300 border hover:shadow-md"
    >
      <div className="relative overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block aspect-square relative">
          <Image
            src={primaryImage}
            alt={product.name}
            data-ai-hint="product image"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPercentage > 0 && <Badge variant="destructive" className="rounded-md">-{discountPercentage}%</Badge>}
          {isNew() && <Badge className="bg-white text-black hover:bg-white/90 border border-gray-200 rounded-md">New</Badge>}
        </div>

        <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleWishlistClick}
            aria-label="Add to wishlist"
        >
            <Heart className={cn("h-4 w-4", onWishlist && "text-red-500 fill-red-500")} />
        </Button>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <p className="text-sm text-muted-foreground">{product.brand || 'Generic'}</p>
        <h3 className="text-base font-semibold leading-tight mt-1 flex-grow">
          <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center gap-2 mt-2">
            {renderStars(product.rating || 0)}
        </div>
        <div className="flex items-center gap-2 mt-2">
            <p className="text-lg font-bold text-primary">${defaultVariant.price.toFixed(2)}</p>
            {defaultVariant.originalPrice && <p className="text-sm text-muted-foreground line-through">${defaultVariant.originalPrice.toFixed(2)}</p>}
        </div>
         <Button size="sm" className="w-full mt-4" onClick={handleAddToCart} disabled={defaultVariant.stock === 0}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {defaultVariant.stock === 0 ? 'Out of Stock' : 'Add to cart'}
        </Button>
      </div>
    </Card>
  );
}
