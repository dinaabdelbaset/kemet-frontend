import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type CurrencyCode = "EGP" | "USD" | "EUR" | "GBP" | "SAR";
export type Theme = "light" | "dark";

export const CURRENCY_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EGP: 48.5,
  EUR: 0.92,
  GBP: 0.79,
  SAR: 3.75,
};

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}

export interface RecentlyViewedItem {
  id: string | number;
  title: string;
  image: string;
  type: "hotel" | "tour" | "safari" | "museum" | "bazaar" | "restaurant" | "package";
  link: string;
}

interface AppContextType {
  // Theme
  theme: Theme;
  toggleTheme: () => void;
  // Currency
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  // Auth
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  // Wishlist
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  // Custom Toast
  showToast: (message: string, isError?: boolean) => void;
  // Recently Viewed
  recentlyViewed: RecentlyViewedItem[];
  addRecentlyViewed: (item: RecentlyViewedItem) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Custom Toast State
  const [toastMsg, setToastMsg] = useState<{message: string; isError: boolean} | null>(null);

  // Load initial states from localStorage
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('app_theme') as Theme) || 'light';
  });
  
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('app_currency') as CurrencyCode) || 'USD';
  });

  const [user, setUserState] = useState<User | null>(() => {
    const saved = localStorage.getItem('app_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [wishlist, setWishlistState] = useState<string[]>(() => {
    const saved = localStorage.getItem('app_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyViewed, setRecentlyViewedState] = useState<RecentlyViewedItem[]>(() => {
    const saved = localStorage.getItem('app_recently_viewed');
    return saved ? JSON.parse(saved) : [];
  });

  // Theme logic
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    localStorage.setItem('app_theme', newTheme);
  };

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('app_currency', code);
  };

  const showToast = (message: string, isError = false) => {
    setToastMsg({ message, isError });
    setTimeout(() => {
      setToastMsg(null);
    }, 3500);
  };

  const login = (newUser: User) => {
    setUserState(newUser);
    localStorage.setItem('app_user', JSON.stringify(newUser));
    showToast(`Welcome back, ${newUser.name}!`);
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem('app_user');
    showToast('You have been logged out.');
  };

  const updateUser = (updates: Partial<User>) => {
    setUserState((prev) => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...updates };
      localStorage.setItem('app_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const toggleWishlist = (id: string) => {
    let newWishlist;
    if (wishlist.includes(id)) {
      newWishlist = wishlist.filter(itemId => itemId !== id);
      showToast('Removed from your wishlist');
    } else {
      newWishlist = [...wishlist, id];
      showToast('Added to your wishlist!');
    }
    setWishlistState(newWishlist);
    localStorage.setItem('app_wishlist', JSON.stringify(newWishlist));
  };

  const isInWishlist = (id: string) => wishlist.includes(id);

  const addRecentlyViewed = (item: RecentlyViewedItem) => {
    setRecentlyViewedState((prev) => {
      const filtered = prev.filter((i) => i.id !== item.id || i.type !== item.type);
      const updated = [item, ...filtered].slice(0, 10); // Keep last 10
      localStorage.setItem('app_recently_viewed', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currency,
        setCurrency,
        user,
        login,
        logout,
        updateUser,
        wishlist,
        toggleWishlist,
        isInWishlist,
        showToast,
        recentlyViewed,
        addRecentlyViewed,
      }}
    >
      {toastMsg && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-full shadow-lg font-semibold text-sm transition-all animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-none ${toastMsg.isError ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
           {toastMsg.message}
        </div>
      )}
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
