
'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react';
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
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      try {
        const parsedCart = savedCart ? JSON.parse(savedCart) : [];
        // Basic validation to prevent malformed cart state
        if (Array.isArray(parsedCart)) {
          return parsedCart;
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1, variant?: ProductVariant) => {
    // Ensure we have a variant, defaulting to the first one if not provided.
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
      
      if (existingItem) {
        // If item exists, update its quantity
        return prevItems.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // If item does not exist, add it to the cart
        const newCartItem: CartItem = {
          ...product,
          id: cartItemId, // This is now the unique cart item ID
          quantity: quantity,
          selectedVariant: selectedVariant,
        };
        return [...prevItems, newCartItem];
      }
    });

    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedVariant.weight}) has been added to your cart.`,
    })
  };

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
    // Ensure selectedVariant and its price exist to prevent crashes
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
