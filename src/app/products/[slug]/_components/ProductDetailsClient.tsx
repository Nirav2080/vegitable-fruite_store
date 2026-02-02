
'use client'

import { useState } from 'react';
import type { Product, ProductVariant } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, ShoppingCart, Star, Heart, CheckCircle2 } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { ProductReviews } from './ProductReviews';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Breadcrumbs } from '@/app/(customer)/_components/Breadcrumbs';
import { useWishlist } from '@/hooks/use-wishlist';
import { Label } from '@/components/ui/label';

interface ProductDetailsClientProps {
  product: Product;
  relatedProducts: Product[];
}

function renderStars(rating: number) {
    const totalStars = 5;
    const filledStars = Math.round(rating);
    return (
        <div className="flex items-center">
            {[...Array(totalStars)].map((_, i) => (
                <Star
                    key={i}
                    className={`w-4 h-4 ${i < filledStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );
}

export function ProductDetailsClient({ product, relatedProducts }: ProductDetailsClientProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(product.variants?.[0]);

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(product, quantity, selectedVariant);
    }
  };

  if (!selectedVariant) {
    return <div>This product is currently unavailable.</div>;
  }
  
  const images = Array.isArray(product.images) ? product.images : [product.images];
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  const onWishlist = isInWishlist(product.id);
  const discountPercentage = selectedVariant.originalPrice ? Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100) : 0;
  
  const breadcrumbLinks = [
      { label: 'Home', href: '/' },
      { label: product.category, href: `/products?category=${product.category}`},
      { label: product.name }
  ]
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs links={breadcrumbLinks} />
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mt-6">
        <div className='flex gap-4'>
          <div className="flex flex-col gap-2">
            {images.map((img, index) => (
              <button key={index} onClick={() => setSelectedImage(index)} className={`w-20 h-20 relative rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-primary' : 'border-gray-200'}`}>
                <Image src={img} alt={`${product.name} thumbnail ${index + 1}`} fill className="object-contain" />
              </button>
            ))}
          </div>
          <div className="aspect-square relative rounded-lg overflow-hidden border flex-1">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className='-mt-2'>
          <h1 className="text-3xl font-bold font-headline">{product.name}</h1>
           <div className="flex items-center gap-4 mt-2">
             <div className="flex items-center gap-2">
                {renderStars(product.rating || 0)}
                <span className="text-sm text-muted-foreground hover:underline cursor-pointer">({reviews.length} reviews)</span>
            </div>
          </div>
          {product.brand && <p className="text-sm text-muted-foreground mt-2">Brand: <span className="text-foreground font-medium">{product.brand}</span></p>}
          
          <p className="mt-4 text-muted-foreground text-sm">{product.description}</p>
          
           {selectedVariant.stock > 0 ? (
                <div className='flex items-center gap-2 mt-4 text-green-600'>
                    <CheckCircle2 className="h-5 w-5"/>
                    <span className='font-semibold'>In Stock</span>
                </div>
            ) : (
                <Badge variant="destructive">Out of Stock</Badge>
            )}

            {selectedVariant.stock > 0 && selectedVariant.stock < 50 && (
                <div className='mt-4'>
                    <p className='text-sm text-yellow-600 font-semibold mb-2'>Hurry! only {selectedVariant.stock} items left in stock.</p>
                    <Progress value={selectedVariant.stock} max={50} className="h-2" />
                </div>
            )}
            
            <Separator className="my-6" />

            {product.variants && product.variants.length > 1 && (
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">Select Weight:</Label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <Button
                      key={variant.weight}
                      variant={selectedVariant?.weight === variant.weight ? 'default' : 'outline'}
                      onClick={() => setSelectedVariant(variant)}
                      className="rounded-full"
                    >
                      {variant.weight}
                    </Button>
                  ))}
                </div>
              </div>
            )}


            <div className='flex items-baseline gap-2'>
                <span className="text-3xl font-bold text-primary">${selectedVariant.price.toFixed(2)}</span>
                {selectedVariant.originalPrice && (
                    <>
                        <span className="text-xl text-muted-foreground line-through">${selectedVariant.originalPrice.toFixed(2)}</span>
                        <Badge variant="destructive">Save {discountPercentage}%</Badge>
                    </>
                )}
            </div>

          <div className="mt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-bold">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button size="lg" onClick={handleAddToCart} disabled={selectedVariant.stock === 0} className="flex-1">
                <ShoppingCart className="mr-2 h-5 w-5" /> {selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>

          <div className="mt-4 flex gap-4 text-sm">
            <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary" onClick={() => toggleWishlist(product)}>
                <Heart className={cn("mr-2 h-4 w-4", {'text-red-500 fill-red-500': onWishlist})} />
                Add To Wishlist
            </Button>
          </div>
         
        </div>
      </div>
      
       <Separator className="my-12" />

      <ProductReviews productId={product.id} reviews={reviews} />

      <Separator className="my-12" />

      <div>
        <h2 className="text-2xl font-bold font-headline mb-6 text-center">You Might Also Like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
