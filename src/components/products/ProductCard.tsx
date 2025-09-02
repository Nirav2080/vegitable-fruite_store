
'use client'

import type { Product } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart, GitCompareArrows, Expand } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const images = Array.isArray(product.images) ? product.images : [product.images];
  const primaryImage = images[0] || 'https://placehold.co/400x400/EEE/31343C';
  const hoverImage = images[1] || primaryImage;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  }

  const handleActionClick = (e: React.MouseEvent<HTMLButtonElement>, feature: string) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Coming Soon!",
      description: `The ${feature} feature is not yet available.`,
    });
  };

  const discountPercentage = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  
  const isNew = () => {
    const today = new Date();
    const productDate = new Date(product.createdAt);
    const diffTime = Math.abs(today.getTime() - productDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }

  return (
    <Card 
        className="flex flex-col h-full overflow-hidden group transition-all duration-300 border"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block aspect-square relative">
          <Image
            src={isHovered ? hoverImage : primaryImage}
            alt={product.name}
            data-ai-hint="product image"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPercentage > 0 && <Badge variant="destructive" className="rounded-full">-{discountPercentage}%</Badge>}
          {isNew() && <Badge className="bg-white text-black hover:bg-white/90 border border-gray-200">New</Badge>}
        </div>
        
        <div className={cn(
            "absolute top-2 right-2 flex flex-col gap-2 transition-all duration-300 opacity-0 group-hover:opacity-100",
            { "opacity-100": isHovered }
            )}>
           <Button variant="outline" size="icon" className="bg-white rounded-full h-8 w-8 hover:bg-primary hover:text-white" onClick={(e) => handleActionClick(e, 'Quick View')}>
                <Expand className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white rounded-full h-8 w-8 hover:bg-primary hover:text-white" onClick={(e) => handleActionClick(e, 'Wishlist')}>
                <Heart className="h-4 w-4" />
            </Button>
             <Button variant="outline" size="icon" className="bg-white rounded-full h-8 w-8 hover:bg-primary hover:text-white" onClick={(e) => handleActionClick(e, 'Compare')}>
                <GitCompareArrows className="h-4 w-4" />
            </Button>
        </div>
        
        <div className={cn(
            "absolute bottom-0 left-0 right-0 p-2 transition-all duration-300 opacity-0 group-hover:opacity-100",
            { "opacity-100": isHovered }
            )}>
             <Button size="sm" className="w-full" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to cart
            </Button>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
         <p className="text-sm text-muted-foreground">{product.category}</p>
        <h3 className="text-base font-semibold leading-tight mt-1 flex-grow">
          <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
            <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
            {product.originalPrice && <p className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</p>}
        </div>
      </div>
    </Card>
  );
}
