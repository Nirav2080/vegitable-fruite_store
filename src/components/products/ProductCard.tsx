
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
        className="flex flex-col h-full overflow-hidden group rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:shadow-xl hover:shadow-black/[0.04] hover:-translate-y-1 hover:border-border/60"
    >
      {/* Image area */}
      <div className="relative overflow-hidden bg-secondary/40 rounded-t-2xl">
        <Link href={`/products/${product.slug}`} className="block aspect-[4/3.5] relative">
            {primaryImage ? (
                <Image
                    src={primaryImage}
                    alt={product.name}
                    data-ai-hint="product image"
                    fill
                    className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-110"
                />
            ) : (
                <div className="h-full w-full flex items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
                </div>
            )}
        </Link>
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {discountPercentage > 0 && (
                <Badge className="rounded-lg bg-red-500 text-white border-0 px-2 py-0.5 text-[10px] font-bold shadow-lg shadow-red-500/20">-{discountPercentage}%</Badge>
            )}
            {product.isOrganic && (
                <Badge className="rounded-lg bg-primary text-primary-foreground border-0 px-2 py-0.5 text-[10px] font-bold shadow-lg shadow-primary/20">Fresh</Badge>
            )}
        </div>
        {/* Wishlist button */}
        <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 rounded-xl bg-white/80 dark:bg-black/40 backdrop-blur-md shadow-sm opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-white dark:hover:bg-black/60 hover:scale-110"
            onClick={handleWishlistClick}
            aria-label="Add to wishlist"
        >
            <Heart className={cn("h-4 w-4 transition-colors", onWishlist ? "text-red-500 fill-red-500" : "text-foreground/60")} />
        </Button>
      </div>

      {/* Content area */}
      <div className="p-4 flex-grow flex flex-col gap-2">
        {/* Title & price row */}
        <div className="flex justify-between items-start gap-2">
            <h3 className="text-sm font-semibold leading-snug flex-grow line-clamp-2">
                <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors duration-200">
                    {product.name}
                </Link>
            </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
            {renderStars(product.rating || 0)}
            <span className="text-[11px] text-muted-foreground">({product.reviews?.length || 0})</span>
        </div>

        {/* Variants */}
        <div className="min-h-[32px]">
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
                            className={cn(
                              "h-auto px-2 py-0.5 text-[11px] rounded-lg transition-all duration-200",
                              selectedVariant?.weight === variant.weight
                                ? "shadow-sm shadow-primary/20"
                                : "border-border/40"
                            )}
                        >
                            {variant.weight}
                        </Button>
                    ))}
                </div>
            ) : (
                 <p className="text-xs text-muted-foreground">{selectedVariant.weight}</p>
            )}
        </div>

        {/* Price & CTA */}
        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-foreground">${selectedVariant.price.toFixed(2)}</span>
                {discountPercentage > 0 && selectedVariant.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">${selectedVariant.originalPrice.toFixed(2)}</span>
                )}
            </div>
            <Button
              size="sm"
              className="rounded-xl h-9 px-4 text-xs font-semibold shadow-sm transition-all duration-300 hover:shadow-md"
              onClick={handleAddToCart}
              disabled={selectedVariant.stock === 0}
            >
                {selectedVariant.stock === 0 ? 'Sold Out' : 'Add'}
            </Button>
        </div>
      </div>
    </div>
  );
}
