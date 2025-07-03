import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Equipment, DivePackage } from '../types';
import { mockEquipment, mockDivePackages } from '../data/mockData';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'addedAt'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateItem: (itemId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getItemCount: () => number;
  getItemDetails: (item: CartItem) => Equipment | DivePackage | null;
  validateCart: () => { isValid: boolean; errors: string[] };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('stg_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Convert date strings back to Date objects
        const cartWithDates = parsedCart.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
          selectedDate: item.selectedDate ? new Date(item.selectedDate) : undefined
        }));
        setItems(cartWithDates);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem('stg_cart');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('stg_cart', JSON.stringify(items));
  }, [items]);

  const generateCartItemId = () => {
    return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addItem = (newItem: Omit<CartItem, 'id' | 'addedAt'>) => {
    setItems(prev => {
      // Check for existing similar item
      const existingIndex = prev.findIndex(item => 
        item.type === newItem.type &&
        item.equipmentId === newItem.equipmentId &&
        item.packageId === newItem.packageId &&
        item.rentalDuration === newItem.rentalDuration &&
        item.selectedDate?.getTime() === newItem.selectedDate?.getTime()
      );
      
      if (existingIndex !== -1) {
        // Update existing item
        const updatedItems = [...prev];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + newItem.quantity,
          participants: newItem.participants || updatedItems[existingIndex].participants
        };
        return updatedItems;
      } else {
        // Add new item
        const cartItem: CartItem = {
          ...newItem,
          id: generateCartItemId(),
          addedAt: new Date()
        };
        return [...prev, cartItem];
      }
    });
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const updateItem = (itemId: string, updates: Partial<CartItem>) => {
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemDetails = (item: CartItem): Equipment | DivePackage | null => {
    if (item.equipmentId) {
      return mockEquipment.find(e => e.id === item.equipmentId) || null;
    }
    if (item.packageId) {
      return mockDivePackages.find(p => p.id === item.packageId) || null;
    }
    return null;
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => {
      const multiplier = item.type === 'package' ? (item.participants || 1) : item.quantity;
      return total + (item.price * multiplier);
    }, 0);
  };

  const getTotal = () => {
    // For now, total equals subtotal. In a real app, you'd add tax, shipping, etc.
    return getSubtotal();
  };

  const getItemCount = () => {
    return items.reduce((count, item) => {
      const multiplier = item.type === 'package' ? (item.participants || 1) : item.quantity;
      return count + multiplier;
    }, 0);
  };

  const validateCart = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    for (const item of items) {
      const details = getItemDetails(item);
      
      if (!details) {
        errors.push(`Item ${item.id} is no longer available`);
        continue;
      }
      
      if (item.type === 'purchase' || item.type === 'rental') {
        const equipment = details as Equipment;
        if (!equipment.available) {
          errors.push(`${equipment.name} is currently out of stock`);
        }
        if (item.quantity > equipment.stock) {
          errors.push(`Only ${equipment.stock} units of ${equipment.name} are available`);
        }
        if (item.type === 'rental' && !equipment.isRentable) {
          errors.push(`${equipment.name} is not available for rental`);
        }
      }
      
      if (item.type === 'package') {
        const pkg = details as DivePackage;
        const participants = item.participants || 1;
        if (participants < pkg.minParticipants) {
          errors.push(`${pkg.name} requires minimum ${pkg.minParticipants} participants`);
        }
        if (participants > pkg.maxParticipants) {
          errors.push(`${pkg.name} allows maximum ${pkg.maxParticipants} participants`);
        }
        if (item.selectedDate && !pkg.availableDates.some(date => 
          date.toDateString() === item.selectedDate!.toDateString()
        )) {
          errors.push(`Selected date for ${pkg.name} is not available`);
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      updateItem,
      clearCart,
      getTotal,
      getSubtotal,
      getItemCount,
      getItemDetails,
      validateCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};