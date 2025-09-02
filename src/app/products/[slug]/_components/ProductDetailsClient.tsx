
'use client'

import { useState } from 'react';
import type { Product, Review } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, ShoppingCart, Star } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { ProductReviews } from './ProductReviews';


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
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  const images = Array.isArray(product.images) ? product.images : [product.images];
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
        <div className='md:col-span-2'>
          <div className="aspect-square relative rounded-lg overflow-hidden border">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex gap-2 mt-2">
            {images.map((img, index) => (
              <button key={index} onClick={() => setSelectedImage(index)} className={`w-20 h-20 relative rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-primary' : 'border-transparent'}`}>
                <Image src={img} alt={`${product.name} thumbnail ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className='md:col-span-3'>
          <h1 className="text-3xl lg:text-4xl font-bold font-headline">{product.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            {product.stock > 0 ? (
                <Badge variant="secondary" className='bg-green-100 text-green-800'>In Stock</Badge>
            ) : (
                <Badge variant="destructive">Out of Stock</Badge>
            )}
             <div className="flex items-center gap-2">
                {renderStars(product.rating || 0)}
                <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-primary mt-4">${product.price.toFixed(2)}</p>
          <div className="prose mt-4" dangerouslySetInnerHTML={{ __html: product.description }} />


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
              <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={product.stock === 0}>
                <ShoppingCart className="mr-2 h-5 w-5" /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            {product.isOrganic && <Badge variant="outline">Certified Organic</Badge>}
            {product.isSeasonal && <Badge variant="outline">Seasonal Special</Badge>}
          </div>
        </div>
      </div>
      
       <Separator className="my-12" />

      <ProductReviews productId={product.id} reviews={reviews} />

      <Separator className="my-12" />

      <div>
        <h2 className="text-2xl font-bold font-headline mb-6 text-center">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
