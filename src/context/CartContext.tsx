
'use client'

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { CartItem, Product, ProductVariant } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to generate a unique ID for each cart item
const generateCartItemId = (productId: string, variantWeight?: string) => {
  return variantWeight ? `${productId}_${variantWeight}` : productId;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (isMounted) {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            setCartItems(parsedCart);
          }
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        setCartItems([]);
      }
    }
  }, [isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const addToCart = useCallback((product: Product, quantity: number = 1, variant?: ProductVariant) => {
    const selectedVariant = variant || product.variants?.[0];
    
    if (!selectedVariant) {
        toast({
            title: "Cannot add to cart",
            description: "This product is currently unavailable or has no options.",
            variant: "destructive",
        });
        return;
    }

    setCartItems(prevItems => {
      const cartItemId = generateCartItemId(product.id, selectedVariant.weight);
      const existingItem = prevItems.find(item => item.id === cartItemId);
      
      let newItems;

      if (existingItem) {
        newItems = prevItems.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newCartItem: CartItem = {
          ...product,
          id: cartItemId,
          quantity: quantity,
          selectedVariant: selectedVariant,
        };
        newItems = [...prevItems, newCartItem];
      }

      const updatedItem = newItems.find(item => item.id === cartItemId);
      const displayQuantity = updatedItem ? updatedItem.quantity : quantity;
      
      toast({
        title: "Added to cart",
        description: `${product.name} (${displayQuantity}) has been added to your cart.`,
      });

      return newItems;
    });
  }, [toast]);

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prevItems => {
        const newItems = prevItems.filter(item => item.id !== cartItemId);
        if(newItems.length === 0) {
            localStorage.removeItem('cart');
        }
        return newItems;
    });
    toast({
      title: "Item removed",
      description: `The item has been removed from your cart.`,
      variant: "destructive"
    })
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const cartCount = isMounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const cartTotal = isMounted ? cartItems.reduce((acc, item) => {
    if (item.selectedVariant && typeof item.selectedVariant.price === 'number') {
      return acc + item.selectedVariant.price * item.quantity;
    }
    return acc;
  }, 0) : 0;


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
