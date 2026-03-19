
'use client'

import type { Product, ProductVariant } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
// import Link from "next/link"; // Product detail page disabled for future use
import { Star, Heart, ImageIcon, Minus, Plus } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useState, useEffect } from "react";
import { cn, parseWeightToGrams, getProductMode, formatWeight, getPieceLabel } from "@/lib/utils";
import { useWishlist } from "@/hooks/use-wishlist";

interface ProductCardProps {
  product: Product;
}

// ─── Stars ───────────────────────────────────────────────────────────────────

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

// Component

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isClient, setIsClient] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(product.variants?.[0]);

  // Stepper state — qtyValue for tracking the actual number (grams for weight, pieces for piece-mode)
  const [qtyValue, setQtyValue] = useState<number>(100);
  const [weightUnit, setWeightUnit] = useState<'g' | 'kg'>('g');
  const [inputValue, setInputValue] = useState<string>('100');

  useEffect(() => { setIsClient(true); }, []);

  // Reset stepper when variant changes
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

  // Step config
  const STEP = mode === 'weight' ? 100 : 1;
  const MIN = mode === 'weight' ? 100 : 1;

  // Pricing
  const pricePerKg = getPricePerKg(selectedVariant);
  const originalPricePerKg = selectedVariant.originalPrice
    ? (selectedVariant.originalPrice / (parseWeightToGrams(selectedVariant.weight) || 1)) * 1000
    : null;

  const calculatedPrice = mode === 'weight'
    ? (pricePerKg / 1000) * qtyValue
    : selectedVariant.price * qtyValue;

  const discountPercentage = selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price
    ? Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100)
    : 0;

  // Base price label
  const basePriceLabel = mode === 'weight'
    ? `$${pricePerKg.toFixed(2)} / kg`
    : `$${selectedVariant.price.toFixed(2)} / ${getPieceLabel(selectedVariant, product.unitType, 1)}`;

  const originalBasePriceLabel = mode === 'weight' && originalPricePerKg
    ? `$${originalPricePerKg.toFixed(2)}/kg`
    : selectedVariant.originalPrice
      ? `$${selectedVariant.originalPrice.toFixed(2)}`
      : null;

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

  const onWishlist = isClient && isInWishlist(product.id);

  return (
    <div className="flex flex-col h-full overflow-hidden group rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:shadow-xl hover:shadow-black/[0.04] hover:-translate-y-1 hover:border-border/60">

      {/* Image area */}
      <div className="relative overflow-hidden bg-secondary/40 rounded-t-2xl">
        {/* Product detail page link commented out for future use */}
        {/* <Link href={`/products/${product.slug}`} className="block aspect-[4/3.5] relative"> */}
        <div className="block aspect-[4/3.5] relative">
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
          {/* </Link> */}
        </div>

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

        {/* Title */}
        <h3 className="text-sm font-semibold leading-snug line-clamp-2">
          {/* <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors duration-200"> */}
          {product.name}
          {/* </Link> */}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          {renderStars(product.rating || 0)}
          <span className="text-[11px] text-muted-foreground">({product.reviews?.length || 0})</span>
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
                className={cn(
                  "h-auto px-2 py-0.5 text-[11px] rounded-lg transition-all duration-200",
                  selectedVariant?.weight === variant.weight ? "shadow-sm shadow-primary/20" : "border-border/40"
                )}
              >
                {variant.weight}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">{selectedVariant.weight}</p>
        )}

        {/* Base price per kg / per piece */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold text-foreground">{basePriceLabel}</span>
          {discountPercentage > 0 && originalBasePriceLabel && (
            <span className="text-xs text-muted-foreground line-through">{originalBasePriceLabel}</span>
          )}
        </div>

        {/* Smart +/- stepper */}
        <div className="mt-auto rounded-xl border border-border/50 bg-secondary/30 p-2 flex flex-col gap-2">
          {/* Stepper row */}
          <div className="flex items-center gap-2">
            {/* Minus */}
            <button
              type="button"
              onClick={handleMinus}
              disabled={qtyValue <= MIN}
              className={cn(
                "h-8 w-8 flex-shrink-0 rounded-lg flex items-center justify-center border transition-all duration-150",
                qtyValue <= MIN
                  ? "border-border/30 text-muted-foreground/30 cursor-not-allowed"
                  : "border-border/50 bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
              )}
              aria-label="Decrease"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>

            {/* Value display */}
            <div className="flex-1 h-8 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-center overflow-hidden">
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
              className="h-8 w-8 flex-shrink-0 rounded-lg flex items-center justify-center border border-border/50 bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-150"
              aria-label="Increase"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Calculated price row */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] text-muted-foreground">
              {mode === 'weight' ? `${formatWeight(qtyValue)} price` : `${qtyValue}× price`}
            </span>
            <span className="text-sm font-bold text-primary">${calculatedPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Add to cart */}
        <Button
          size="sm"
          className="w-full rounded-xl h-9 text-xs font-semibold shadow-sm transition-all duration-300 hover:shadow-md"
          onClick={handleAddToCart}
          disabled={selectedVariant.stock === 0}
        >
          {selectedVariant.stock === 0 ? 'Sold Out' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}
