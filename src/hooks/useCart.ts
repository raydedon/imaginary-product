import { useContext } from 'react';
import { CartContext, CartContextState } from '../contexts/CartProvider';

export const useCart = (): CartContextState => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};

