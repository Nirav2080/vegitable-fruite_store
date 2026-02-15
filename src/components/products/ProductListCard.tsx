
'use client'

import type { Product, ProductVariant } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Heart, ZoomIn, GitCompareArrows, ImageIcon } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/use-wishlist";

interface ProductListCardProps {
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

export function ProductListCard({ product }: ProductListCardProps) {
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
  
  const isNew = () => {
    const today = new Date();
    const productDate = new Date(product.createdAt);
    const diffTime = Math.abs(today.getTime() - productDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }
  
  return (
    <div className="group/list-card w-full rounded-lg border p-4 transition-shadow duration-300 hover:shadow-md">
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative aspect-square sm:w-48 sm:flex-shrink-0">
                <Link href={`/products/${product.slug}`} className="block h-full w-full">
                    {primaryImage ? (
                        <Image
                            src={primaryImage}
                            alt={product.name}
                            data-ai-hint="product image"
                            fill
                            className="rounded-md object-cover"
                        />
                    ) : (
                        <div className="h-full w-full bg-muted rounded-md flex items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                    )}
                </Link>
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {discountPercentage > 0 && <Badge variant="destructive" className="rounded-md">-{discountPercentage}%</Badge>}
                    {isNew() && <Badge className="bg-white text-black hover:bg-white/90 border border-gray-200 rounded-md">New</Badge>}
                    {product.isOrganic && <Badge className="bg-primary text-primary-foreground rounded-md">Fresh</Badge>}
                </div>
                <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover/list-card:opacity-100 transition-opacity duration-300">
                     <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                        onClick={handleWishlistClick}
                        aria-label="Add to wishlist"
                    >
                        <Heart className={cn("h-4 w-4", onWishlist && "text-red-500 fill-red-500")} />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                        aria-label="Quick View"
                    >
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                        aria-label="Compare"
                    >
                        <GitCompareArrows className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            
            <div className="flex flex-1 flex-col">
                <p className="text-xs text-muted-foreground">{product.brand || 'Generic'}</p>
                <h3 className="text-base font-semibold leading-tight mt-1">
                    <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
                        {product.name}
                    </Link>
                </h3>
                <div className="flex items-center gap-2 mt-1">
                    {renderStars(product.rating || 0)}
                    <span className="text-xs text-muted-foreground">({product.reviews.length} reviews)</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4">
                     <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-primary">${selectedVariant.price.toFixed(2)}</p>
                        {selectedVariant.originalPrice && <p className="text-sm text-muted-foreground line-through">${selectedVariant.originalPrice.toFixed(2)}</p>}
                    </div>
                </div>

                <div className="mt-2">
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
                         <p className="text-sm text-muted-foreground">{selectedVariant.weight}</p>
                    )}
                </div>

                 <Button size="sm" className="mt-2 w-full sm:w-auto" onClick={handleAddToCart} disabled={selectedVariant.stock === 0}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to cart'}
                </Button>
            </div>
        </div>
    </div>
  );
}
