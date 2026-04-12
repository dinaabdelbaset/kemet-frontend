import React, { createContext, useContext, useState, useEffect, type ReactNode, useRef } from 'react';
import axiosClient from '../api/axiosClient';

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
  points?: number;
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
    const savedUser = localStorage.getItem('app_user');
    return (saved && savedUser) ? JSON.parse(saved) : [];
  });

  const [recentlyViewed, setRecentlyViewedState] = useState<RecentlyViewedItem[]>(() => {
    const saved = localStorage.getItem('app_recently_viewed');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Optionally, if the user was already logged in on refresh, pull Wishlist:
  useEffect(() => {
     if (user) {
        axiosClient.get("/wishlist").then(({ data }) => {
           const wList = data.map((d: any) => {
               let strType = "";
               if (d.item_type.includes("Hotel")) strType = "hotel";
               else if (d.item_type.includes("Tour")) strType = "tour";
               else if (d.item_type.includes("Activity")) strType = "activity";
               else if (d.item_type.includes("Safari")) strType = "safari";
               else if (d.item_type.includes("Bazaar")) strType = "bazaar";
               else if (d.item_type.includes("Museum")) strType = "museum";
               else if (d.item_type.includes("Restaurant")) strType = "restaurant";
               return strType ? `${strType}-${d.item_id}` : d.item_id;
           });
           setWishlistState(wList);
           localStorage.setItem('app_wishlist', JSON.stringify(wList));
        }).catch(() => {});
     }
  }, []);

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
    setWishlistState([]);
    setRecentlyViewedState([]);
    localStorage.removeItem('app_user');
    localStorage.removeItem('app_wishlist');
    localStorage.removeItem('app_recently_viewed');
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

  const toggleWishlist = async (id: string) => {
    if (!user) {
      showToast('Please login to use your wishlist.', true);
      return;
    }
    
    const isAdding = !wishlist.includes(id);
    let newWishlist;
    if (!isAdding) {
      newWishlist = wishlist.filter(itemId => itemId !== id);
      showToast('Removed from your wishlist');
    } else {
      newWishlist = [...wishlist, id];
      showToast('Added to your wishlist!');
    }
    
    setWishlistState(newWishlist);
    localStorage.setItem('app_wishlist', JSON.stringify(newWishlist));
    
    // Background DB Sync
    try {
        const [type, actualId] = id.split('-'); // format from click e.g. "hotel-12"
        const mappedType = type ? `App\\Models\\ucfirst(${type})` : 'App\\Models\\Item';
        let finalType = mappedType;
        
        if (type === 'hotel') finalType = 'App\\Models\\Hotel';
        else if (type === 'tour') finalType = 'App\\Models\\Tour';
        else if (type === 'safari') finalType = 'App\\Models\\Safari';
        else if (type === 'museum') finalType = 'App\\Models\\Museum';
        else if (type === 'bazaar') finalType = 'App\\Models\\Bazaar';
        else if (type === 'restaurant') finalType = 'App\\Models\\Restaurant';
        else if (type === 'deal') finalType = 'App\\Models\\Deal';
        else if (type === 'activity') finalType = 'App\\Models\\Activity';

        if (isAdding) {
            await axiosClient.post("/wishlist", { item_id: actualId, type: finalType });
        } else {
            // Because the backend expects the primary ID of wishlist to delete, we should send a query param of the item format
            await axiosClient.delete(`/wishlist/${actualId}?type=${finalType}`);
        }
    } catch (e) {
        console.error("Failed to sync wishlist", e);
    }
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
