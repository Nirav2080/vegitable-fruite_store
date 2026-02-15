
'use client'

import type { Product, ProductVariant } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ImageIcon } from "lucide-react";
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
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(product.variants?.[0]);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!selectedVariant) {
    return null; 
  }

  const images = Array.isArray(product.images) ? product.images : [];
  const primaryImage = images[0];
  
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, selectedVariant);
  }

  const handleWishlistClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  }

  const handleVariantChange = (variantWeight: string) => {
    const newVariant = product.variants.find(v => v.weight === variantWeight);
    if(newVariant) {
        setSelectedVariant(newVariant);
    }
  }

  const onWishlist = isClient && isInWishlist(product.id);
  const discountPercentage = selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price
    ? Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100)
    : 0;
  
  return (
    <div 
        className="flex flex-col h-full overflow-hidden group transition-all duration-300"
    >
      <div className="relative overflow-hidden p-4 bg-secondary rounded-lg">
        <Link href={`/products/${product.slug}`} className="block aspect-square relative">
            {primaryImage ? (
                <Image
                    src={primaryImage}
                    alt={product.name}
                    data-ai-hint="product image"
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
            )}
        </Link>
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {discountPercentage > 0 && (
                <Badge variant="destructive">-{discountPercentage}%</Badge>
            )}
            {product.isOrganic && (
                <Badge className="bg-primary text-primary-foreground">Fresh</Badge>
            )}
        </div>
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
        <div className="flex justify-between items-start gap-2">
            <h3 className="text-base font-medium leading-tight flex-grow pr-2">
                <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
                    {product.name}
                </Link>
            </h3>
            <div className="flex flex-col items-end flex-shrink-0">
                <p className="text-base font-semibold text-primary">${selectedVariant.price.toFixed(2)}</p>
                {discountPercentage > 0 && selectedVariant.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">${selectedVariant.originalPrice.toFixed(2)}</p>
                )}
            </div>
        </div>
         <div className="flex items-center gap-2 mt-2">
            {renderStars(product.rating || 0)}
            <span className='text-xs text-muted-foreground'>({product.reviews?.length || 0})</span>
        </div>
        <div className="mt-2 min-h-[36px]">
            {product.variants.length > 1 ? (
                <div className="flex flex-wrap items-center gap-1">
                    {product.variants.map((variant) => (
                        <Button
                            key={variant.weight}
                            size="sm"
                            variant={selectedVariant?.weight === variant.weight ? 'default' : 'outline'}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleVariantChange(variant.weight);
                            }}
                            className="h-auto px-2 py-1 text-xs rounded-full"
                        >
                            {variant.weight}
                        </Button>
                    ))}
                </div>
            ) : (
                 <p className="text-sm text-muted-foreground pt-2">{selectedVariant.weight}</p>
            )}
        </div>
        
         <Button variant="outline" size="sm" className="w-full mt-4 rounded-full" onClick={handleAddToCart} disabled={selectedVariant.stock === 0}>
            {selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}
