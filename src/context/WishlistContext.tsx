
'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface WishlistContextType {
  wishlistItems: Product[];
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      setWishlistItems(savedWishlist ? JSON.parse(savedWishlist) : []);
    } catch (error) {
        console.error("Failed to parse wishlist from localStorage", error);
        setWishlistItems([]);
    }
    setIsInitial(false);
  }, []);

  useEffect(() => {
    if (!isInitial) {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isInitial]);

  const toggleWishlist = (product: Product) => {
    setWishlistItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
         toast({
          title: "Removed from wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        })
        return prevItems.filter(item => item.id !== product.id);
      } else {
        toast({
          title: "Added to wishlist",
          description: `${product.name} has been added to your wishlist.`,
        })
        return [...prevItems, product];
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
     toast({
      title: "Item removed",
      description: `The item has been removed from your wishlist.`,
    })
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };
  
  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
