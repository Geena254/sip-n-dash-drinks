
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DrinkItem {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface CartItem extends DrinkItem {
  quantity: number;
  options?: string | null;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (drink: DrinkItem, options?: string) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { CartContext };

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (drink: DrinkItem, options?: string) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => 
        item.id === drink.id && item.options === options
      );
      
      if (existingItem) {
        return currentItems.map(item =>
          item.id === drink.id && item.options === options
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...currentItems, { 
        ...drink, 
        quantity: 1, 
        options: options || null 
      }];
    });
  };

  const removeFromCart = (id: number) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
