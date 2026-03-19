
'use client'

import type { Product, ProductVariant } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
// import Link from "next/link"; // Product detail page disabled for future use
import { ShoppingCart, Star, Heart, ImageIcon, Minus, Plus } from "lucide-react";
// import { ZoomIn, GitCompareArrows } from "lucide-react"; // disabled for future use
import { useState, useEffect } from "react";
import { cn, parseWeightToGrams, getProductMode, formatWeight, getPieceLabel } from "@/lib/utils";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";

interface ProductListCardProps {
  product: Product;
}

// ─── Stars ────────────────────────────────────────────────────────────────────

function getPricePerKg(variant: ProductVariant): number {
  const grams = parseWeightToGrams(variant.weight);
  if (!grams) return variant.price;
  return (variant.price / grams) * 1000;
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

// ─── Component ────────────────────────────────────────────────────────────────

export function ProductListCard({ product }: ProductListCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isClient, setIsClient] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(product.variants?.[0]);
  
  const [qtyValue, setQtyValue] = useState<number>(100);
  const [weightUnit, setWeightUnit] = useState<'g' | 'kg'>('g');
  const [inputValue, setInputValue] = useState<string>('100');

  useEffect(() => { setIsClient(true); }, []);

  useEffect(() => {
    if (!selectedVariant) return;
    const mode = getProductMode(selectedVariant, product.unitType);
    const initialVal = mode === 'weight' ? 100 : 1;
    setQtyValue(initialVal);
    setInputValue(mode === 'weight' ? '100' : '1');
    setWeightUnit('g');
  }, [selectedVariant, product.unitType]);

  if (!selectedVariant) return null;

  const images = Array.isArray(product.images) ? product.images : [];
  const primaryImage = images[0];
  const mode = getProductMode(selectedVariant, product.unitType);

  const STEP = mode === 'weight' ? 100 : 1;
  const MIN  = mode === 'weight' ? 100 : 1;

  const pricePerKg = getPricePerKg(selectedVariant);
  const originalPricePerKg = selectedVariant.originalPrice
    ? (selectedVariant.originalPrice / (parseWeightToGrams(selectedVariant.weight) || 1)) * 1000
    : null;

  const discountPercentage = selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price
    ? Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100)
    : 0;

  const calculatedPrice = mode === 'weight'
    ? (pricePerKg / 1000) * qtyValue
    : selectedVariant.price * qtyValue;

  const basePriceLabel = mode === 'weight'
    ? `$${pricePerKg.toFixed(2)} / kg`
    : `$${selectedVariant.price.toFixed(2)} / ${getPieceLabel(selectedVariant, product.unitType, 1)}`;

  const originalBasePriceLabel = mode === 'weight' && originalPricePerKg
    ? `$${originalPricePerKg.toFixed(2)}/kg`
    : selectedVariant.originalPrice ? `$${selectedVariant.originalPrice.toFixed(2)}` : null;

  const onWishlist = isClient && isInWishlist(product.id);

  const isNew = () => {
    const today = new Date();
    const productDate = new Date(product.createdAt);
    const diffDays = Math.ceil(Math.abs(today.getTime() - productDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); e.stopPropagation();
    const qty = mode === 'weight' 
      ? qtyValue / (parseWeightToGrams(selectedVariant.weight) || 1000) 
      : qtyValue;
    addToCart(product, qty, selectedVariant);
  };

  const handleWishlistClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); e.stopPropagation();
    toggleWishlist(product);
  };

  const handleVariantChange = (variantWeight: string) => {
    const newVariant = product.variants.find(v => v.weight === variantWeight);
    if (newVariant) setSelectedVariant(newVariant);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    setInputValue(valStr);
    
    const parsed = parseFloat(valStr);
    if (!isNaN(parsed) && parsed >= 0) {
      if (mode === 'weight' && weightUnit === 'kg') {
        setQtyValue(parsed * 1000);
      } else {
        setQtyValue(parsed);
      }
    } else {
      setQtyValue(0);
    }
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as 'g' | 'kg';
    setWeightUnit(newUnit);
    
    if (newUnit === 'kg') {
      setInputValue((qtyValue / 1000).toString());
    } else {
      setInputValue(qtyValue.toString());
    }
  };

  const handleMinus = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    let newVal = qtyValue - STEP;
    if (newVal < MIN) newVal = MIN;
    setQtyValue(newVal);

    if (mode === 'weight') {
      setInputValue(weightUnit === 'kg' ? (newVal / 1000).toString() : newVal.toString());
    } else {
      setInputValue(newVal.toString());
    }
  };

  const handlePlus = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const newVal = qtyValue + STEP;
    setQtyValue(newVal);

    if (mode === 'weight') {
      setInputValue(weightUnit === 'kg' ? (newVal / 1000).toString() : newVal.toString());
    } else {
      setInputValue(newVal.toString());
    }
  };

  return (
    <div className="group/list-card w-full rounded-2xl border border-border/30 bg-background p-4 transition-all duration-300 hover:shadow-md hover:shadow-black/[0.04] hover:border-border/50">
      <div className="flex flex-col sm:flex-row gap-4">

        {/* Image */}
        <div className="relative aspect-square sm:w-48 sm:flex-shrink-0">
          {/* Product detail page link commented out for future use */}
          {/* <Link href={`/products/${product.slug}`} className="block h-full w-full"> */}
          <div className="block h-full w-full">
            {primaryImage ? (
              <Image
                src={primaryImage}
                alt={product.name}
                data-ai-hint="product image"
                fill
                className="rounded-xl object-cover"
              />
            ) : (
              <div className="h-full w-full bg-secondary/40 rounded-xl flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          {/* </Link> */}
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {discountPercentage > 0 && <Badge variant="destructive" className="rounded-lg px-2.5 py-0.5 text-[10px] font-bold shadow-sm">-{discountPercentage}%</Badge>}
            {isNew() && <Badge className="bg-white text-black hover:bg-white/90 border border-gray-200 rounded-lg px-2.5 py-0.5 text-[10px] font-bold shadow-sm">New</Badge>}
            {product.isOrganic && <Badge className="bg-primary text-primary-foreground rounded-lg px-2.5 py-0.5 text-[10px] font-bold shadow-sm">Fresh</Badge>}
          </div>

          {/* Wishlist */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover/list-card:opacity-100 transition-opacity duration-300">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-xl bg-white/90 backdrop-blur-sm border-border/30 shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md"
              onClick={handleWishlistClick}
              aria-label="Add to wishlist"
            >
              <Heart className={cn("h-4 w-4", onWishlist && "text-red-500 fill-red-500")} />
            </Button>
            {/* Quick View / Compare — disabled for future use
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl bg-white/90 backdrop-blur-sm border-border/30 shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md" aria-label="Quick View">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl bg-white/90 backdrop-blur-sm border-border/30 shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md" aria-label="Compare">
              <GitCompareArrows className="h-4 w-4" />
            </Button> */}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-xs text-muted-foreground">{product.brand || 'Generic'}</p>

          <h3 className="text-base font-semibold leading-tight">
            {/* <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors"> */}
              {product.name}
            {/* </Link> */}
          </h3>

          <div className="flex items-center gap-2">
            {renderStars(product.rating || 0)}
            <span className="text-xs text-muted-foreground">({product.reviews.length} reviews)</span>
          </div>

          {/* Base price */}
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-primary">{basePriceLabel}</p>
            {discountPercentage > 0 && originalBasePriceLabel && (
              <p className="text-sm text-muted-foreground line-through">{originalBasePriceLabel}</p>
            )}
          </div>

          {/* Variants */}
          {product.variants.length > 1 ? (
            <div className="flex flex-wrap items-center gap-1">
              {product.variants.map((variant) => (
                <Button
                  key={variant.weight}
                  size="sm"
                  variant={selectedVariant?.weight === variant.weight ? 'default' : 'outline'}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleVariantChange(variant.weight); }}
                  className="h-auto px-2 py-1 text-xs rounded-xl"
                >
                  {variant.weight}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{selectedVariant.weight}</p>
          )}

          {/* Smart +/- stepper */}
          <div className="rounded-xl border border-border/50 bg-secondary/30 p-2 flex flex-col gap-2 w-full sm:w-72">
            <div className="flex items-center gap-2">
              {/* Minus */}
              <button
                type="button"
                onClick={handleMinus}
                disabled={qtyValue <= MIN}
                className={cn(
                  "h-9 w-9 flex-shrink-0 rounded-lg flex items-center justify-center border transition-all duration-150",
                  qtyValue <= MIN
                    ? "border-border/30 text-muted-foreground/30 cursor-not-allowed"
                    : "border-border/50 bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
                )}
                aria-label="Decrease"
              >
                <Minus className="h-4 w-4" />
              </button>

              {/* Value display */}
              <div className="flex-1 h-9 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-center overflow-hidden">
                {mode === 'weight' ? (
                  <>
                    <input
                      type="number"
                      min="0"
                      step={weightUnit === 'kg' ? "0.1" : "100"}
                      value={inputValue}
                      onChange={handleInputChange}
                      className="w-full min-w-[2rem] h-full bg-transparent text-center text-sm font-bold text-primary outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <select
                      value={weightUnit}
                      onChange={handleUnitChange}
                      className="h-full bg-transparent text-primary text-xs font-bold outline-none cursor-pointer pr-1"
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                    </select>
                  </>
                ) : (
                  <>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={inputValue}
                      onChange={handleInputChange}
                      className="w-full min-w-[2rem] h-full bg-transparent text-center text-sm font-bold text-primary outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-primary text-xs font-bold pr-2 flex-shrink-0">
                      {getPieceLabel(selectedVariant, product.unitType, qtyValue)}
                    </span>
                  </>
                )}
              </div>

              {/* Plus */}
              <button
                type="button"
                onClick={handlePlus}
                className="h-9 w-9 flex-shrink-0 rounded-lg flex items-center justify-center border border-border/50 bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-150"
                aria-label="Increase"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Calculated price */}
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-muted-foreground">
                {mode === 'weight' ? `${formatWeight(qtyValue)} price` : `${qtyValue}× price`}
              </span>
              <span className="text-base font-bold text-primary">${calculatedPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Add to cart */}
          <Button size="sm" className="mt-1 w-full sm:w-auto rounded-xl shadow-sm" onClick={handleAddToCart} disabled={selectedVariant.stock === 0}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}
