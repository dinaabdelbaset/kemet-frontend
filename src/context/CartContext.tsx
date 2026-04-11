import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../api/shopService';
import { useApp } from './AppContext';
import axiosClient from '../api/axiosClient';

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
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('kamet_cart');
    const savedUser = localStorage.getItem('app_user');
    return (savedCart && savedUser) ? JSON.parse(savedCart) : [];
  });

  const { user, showToast } = useApp();
  const prevUser = useRef(user);

  // Initialize cart from database when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const { data } = await axiosClient.get("/cart");
          // map database items into CartItem[] format
          const dbCart = data.map((item: any) => ({
             product: item.product,
             quantity: item.quantity
          }));
          setCart(dbCart);
          localStorage.setItem('kamet_cart', JSON.stringify(dbCart));
        } catch (error) {
          console.error("Failed to load cart from database", error);
        }
      }
    };

    if (!prevUser.current && user) {
      // User just logged in
      fetchCart();
    } else if (prevUser.current && !user) {
      // User logged out
      setCart([]);
      localStorage.removeItem('kamet_cart');
    }
    
    // Also fetch on first load if already logged in
    if (user && Object.is(prevUser.current, user) === false) {
        fetchCart();
    }

    prevUser.current = user;
  }, [user]);

  // Save to local storage whenever cart changes locally
  useEffect(() => {
    localStorage.setItem('kamet_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!user) {
      showToast('Please login to add items to your cart.', true);
      return;
    }

    // Optimistic UI update
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        showToast(`Added another ${product.name} to cart`);
        return newCart;
      } else {
        showToast(`${product.name} added to cart`);
        return [...prevCart, { product, quantity }];
      }
    });

    // Background Database update
    try {
      await axiosClient.post("/cart", {
        product_id: product.id,
        quantity: quantity
      });
    } catch (error) {
       console.error("Failed to sync cart item to database", error);
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!user) return;
    
    // Optimistic UI update
    setCart((prevCart) => prevCart.filter(item => item.product.id !== productId));

    // Database Sync
    try {
      await axiosClient.delete(`/cart/${productId}`);
    } catch (error) {
       console.error("Failed to remove item from database cart", error);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    // Optimistic UI
    setCart([]);

    // DB Sync
    try {
      await axiosClient.delete("/cart");
    } catch (error) {
      console.error("Failed to clear database cart", error);
    }
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
