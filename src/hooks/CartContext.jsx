import React, { createContext, useState, useEffect, useCallback } from 'react';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('shopping-cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('shopping-cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cartItems, isLoading]);

  // Add item to cart or increment quantity if already exists
  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      // Add new item
      return [...prevItems, { ...product, quantity }];
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  // Increment item quantity
  const incrementQuantity = useCallback((productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  // Decrement item quantity
  const decrementQuantity = useCallback((productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  }, []);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Check if item is in cart
  const isInCart = useCallback(
    (productId) => {
      return cartItems.some((item) => item.id === productId);
    },
    [cartItems]
  );

  // Get item quantity
  const getItemQuantity = useCallback(
    (productId) => {
      const item = cartItems.find((item) => item.id === productId);
      return item ? item.quantity : 0;
    },
    [cartItems]
  );

  // Calculate cart totals
  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const getCartItemsCount = useCallback(() => {
    return cartItems.length;
  }, [cartItems]);

  // Calculate tax (example: 10%)
  const getTax = useCallback(() => {
    return getCartTotal() * 0.1;
  }, [getCartTotal]);

  // Calculate shipping (free over $100, else $10)
  const getShipping = useCallback(() => {
    const total = getCartTotal();
    return total > 100 ? 0 : 10;
  }, [getCartTotal]);

  // Calculate grand total
  const getGrandTotal = useCallback(() => {
    return getCartTotal() + getTax() + getShipping();
  }, [getCartTotal, getTax, getShipping]);

  const calculateSubtotal = () => {
    return cartItems?.reduce((sum, item) => sum + item?.price * item?.quantity, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08;
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 50 ? 0 : 9.99;
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    const subtotal = calculateSubtotal();
    if (appliedCoupon === 'SAVE10' && subtotal > 100) return subtotal * 0.1;
    if (appliedCoupon === 'SAVE20' && subtotal > 200) return subtotal * 0.2;
    if (appliedCoupon === 'FREESHIP') return calculateShipping();

    return 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping() - calculateDiscount();
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    setCartItems((prev) =>
    prev?.map((item) =>
    item?.id === itemId ? { ...item, quantity: Math.max(1, newQuantity) } : item
    )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prev) => prev?.filter((item) => item?.id !== itemId));
  };

  const handleApplyCoupon = () => {
    const validCoupons = ['SAVE10', 'SAVE20', 'FREESHIP'];
    if (validCoupons?.includes(couponCode?.toUpperCase())) {
      setAppliedCoupon(couponCode?.toUpperCase());
    } else {
      alert('Invalid coupon code');
    }
  };


  const value = {
    // State
    cartItems,
    isLoading,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,

    // Getters
    isInCart,
    getItemQuantity,
    getCartTotal,
    getCartCount,
    getCartItemsCount,
    getTax,
    getShipping,
    getGrandTotal,
    calculateSubtotal,
    calculateTax,
    calculateShipping,
    calculateDiscount,
    calculateTotal,
    handleUpdateQuantity,
    handleRemoveItem,
    handleApplyCoupon,
    setCouponCode,
    appliedCoupon,
    setIsCheckoutOpen,
    isCheckoutOpen,
    couponCode,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
