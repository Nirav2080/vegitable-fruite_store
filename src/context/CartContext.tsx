
'use client'

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { CartItem, Product, ProductVariant } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { getOfferByCode } from '@/lib/actions/offers';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  subtotal: number;
  originalSubtotal: number;
  savingsFromSales: number;
  totalSavings: number;
  applyDiscount: (code: string) => Promise<void>;
  discountAmount: number;
  couponCode: string | null;
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
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);


  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (isMounted) {
      try {
        const savedCart = localStorage.getItem('cart');
        const savedCoupon = localStorage.getItem('couponCode');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            setCartItems(parsedCart);
          }
        }
        if (savedCoupon) {
            setCouponCode(savedCoupon);
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        setCartItems([]);
      }
    }
  }, [isMounted]);
  
  const subtotal = isMounted ? cartItems.reduce((acc, item) => {
    if (item.selectedVariant && typeof item.selectedVariant.price === 'number') {
      return acc + item.selectedVariant.price * item.quantity;
    }
    return acc;
  }, 0) : 0;

  const originalSubtotal = isMounted ? cartItems.reduce((acc, item) => {
    if (item.selectedVariant) {
      const price = (item.selectedVariant.originalPrice && item.selectedVariant.originalPrice > item.selectedVariant.price)
        ? item.selectedVariant.originalPrice
        : item.selectedVariant.price;
      return acc + price * item.quantity;
    }
    return acc;
  }, 0) : 0;

  const savingsFromSales = originalSubtotal - subtotal;
  const totalSavings = savingsFromSales + discountAmount;

  const cartTotal = subtotal - discountAmount;

  const applyDiscount = useCallback(async (code: string) => {
    if (!code) { // Handle removal
      setDiscountAmount(0);
      setCouponCode(null);
      return;
    }

    const offer = await getOfferByCode(code);

    if (offer && offer.discountValue >= 0) {
        let calculatedDiscount = 0;
        if (offer.scope === 'cart') {
            if (offer.discountType === 'percentage') {
                calculatedDiscount = (subtotal * offer.discountValue) / 100;
            } else { // fixed
                calculatedDiscount = offer.discountValue;
            }
        } else if (offer.scope === 'product' && offer.applicableProductIds) {
            calculatedDiscount = cartItems.reduce((acc, item) => {
                const productId = item.id.split('_')[0];
                if (offer.applicableProductIds?.includes(productId)) {
                    if (offer.discountType === 'percentage') {
                        return acc + (item.selectedVariant.price * item.quantity * offer.discountValue) / 100;
                    } else { // fixed
                        return acc + (offer.discountValue * item.quantity);
                    }
                }
                return acc;
            }, 0);
        }
        
        calculatedDiscount = Math.min(calculatedDiscount, subtotal);

        setDiscountAmount(calculatedDiscount);
        setCouponCode(code);
        toast({
            title: "Coupon Applied",
            description: `Your discount has been applied!`,
        });
    } else {
        setDiscountAmount(0);
        setCouponCode(null);
        toast({
            title: "Invalid Coupon",
            description: "The coupon code you entered is not valid or has expired.",
            variant: "destructive",
        });
    }
  }, [subtotal, toast, cartItems]);


  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
      if (couponCode) {
        localStorage.setItem('couponCode', couponCode);
      } else {
        localStorage.removeItem('couponCode');
      }
    }
  }, [cartItems, isMounted, couponCode]);

  useEffect(() => {
    if(isMounted && couponCode) {
      applyDiscount(couponCode);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal, isMounted]);


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
    setDiscountAmount(0);
    setCouponCode(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('couponCode');
  };

  const cartCount = isMounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        subtotal,
        originalSubtotal,
        savingsFromSales,
        totalSavings,
        applyDiscount,
        discountAmount,
        couponCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
