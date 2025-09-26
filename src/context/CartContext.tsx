
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
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      if (Array.isArray(parsedCart)) {
        setCartItems(parsedCart);
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      setCartItems([]);
    }
    setIsInitial(false);
  }, []);

  useEffect(() => {
    if (!isInitial) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitial]);

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
      const existingItemIndex = prevItems.findIndex(item => item.id === cartItemId);
      let newItems;

      if (existingItemIndex > -1) {
        newItems = [...prevItems];
        newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + quantity
        };
      } else {
        const newCartItem: CartItem = {
          ...product,
          id: cartItemId,
          quantity: quantity,
          selectedVariant: selectedVariant,
        };
        newItems = [...prevItems, newCartItem];
      }
      
      toast({
        title: "Added to cart",
        description: `${product.name} (${selectedVariant.weight}) has been added to your cart.`,
      });

      return newItems;
    });
  }, [toast]);

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
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
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartTotal = cartItems.reduce((acc, item) => {
    if (item.selectedVariant && typeof item.selectedVariant.price === 'number') {
      return acc + item.selectedVariant.price * item.quantity;
    }
    return acc;
  }, 0);


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
