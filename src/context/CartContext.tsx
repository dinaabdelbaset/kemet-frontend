import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../api/shopService';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial cart from local storage if available
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('kamet_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save to local storage whenever cart changes
  useEffect(() => {
    localStorage.setItem('kamet_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // If product already in cart, update quantity
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        // Add new item
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  const totalPrice = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
