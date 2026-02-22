import { createContext, useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchProducts } from '../utils/utils';

export interface CartContextState {
  cartItems: Array<CartItem>;
  isLoading: boolean;
  appliedCoupon: string | null;
  couponCode: string;
  isCheckoutOpen: boolean;
  productCount: number;
  categories: Array<CategoryItem>;
  products: Array<ProductItem>;
  isCategoriesLoading: boolean;
  isProductsLoading: boolean;
  categoriesError: Error | null;
  productsError: Error | null;
  refetchCategories: () => void;
  refetchProducts: () => void;
  addToCart: (product: ProductItem, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
  getCartTotal: () => number;
  getCartCount: () => number;
  getCartItemsCount: () => number;
  getTax: () => number;
  getShipping: () => number;
  getGrandTotal: () => number;
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateShipping: () => number;
  calculateDiscount: () => number;
  calculateTotal: () => number;
  handleUpdateQuantity: (itemId: string, newQuantity: number) => void;
  handleRemoveItem: (itemId: string) => void;
  handleApplyCoupon: () => void;
  setCouponCode: (code: string) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setProductCount: (count: number) => void;
}

export const CartContext = createContext<CartContextState | null>(null);

export interface CartItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  price: number;
  quantity: number;
  images?: Array<{ url: string; alt: string }>;
  category?: CategoryItem;
}

export interface ProductItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  price: number;
  stock: number;
  category?: CategoryItem;
  colors?: Array<string>;
  sizes?: Array<string>;
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
  specifications?: Record<string, string>;
  images?: Array<{ url: string; alt: string }>;
}

export interface CategoryItem {
  id: string;
  title: string;
  description?: string;
  slug: string;
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<Array<CartItem>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [productCount, setProductCount] = useState(50);

  // Fetch categories using React Query
  const {
    data: categories = [] as Array<CategoryItem>,
    isLoading: isCategoriesLoading,
    error: categoriesError,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Fetch products using React Query
  const {
    data: products = [] as Array<ProductItem>,
    isLoading: isProductsLoading,
    error: productsError,
    refetch: refetchProducts
  } = useQuery({
    queryKey: ['products', productCount],
    queryFn: () => fetchProducts(productCount),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    enabled: productCount > 0, // Only fetch if productCount is valid
    refetchOnWindowFocus: false,
  });

  
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
  const addToCart = useCallback((product: ProductItem, quantity = 1) => {
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
  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId: string, quantity: number) => {
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
  const incrementQuantity = useCallback((productId: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  // Decrement item quantity
  const decrementQuantity = useCallback((productId: string) => {
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
    (productId: string) => {
      return cartItems.some((item) => item.id === productId);
    },
    [cartItems]
  );

  // Get item quantity
  const getItemQuantity = useCallback(
    (productId: string): number => {
      const item = cartItems.find((item) => item.id === productId);
      return item ? item.quantity : 0;
    },
    [cartItems]
  );

  // Calculate cart totals
  const getCartTotal = useCallback((): number => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const getCartCount = useCallback((): number => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const getCartItemsCount = useCallback((): number => {
    return cartItems?.length || 0;
  }, [cartItems]);

  // Calculate tax (example: 10%)
  const getTax = useCallback((): number => {
    return getCartTotal() * 0.1;
  }, [getCartTotal]);

  // Calculate shipping (free over $100, else $10)
  const getShipping = useCallback((): number => {
    const total = getCartTotal();
    return total > 100 ? 0 : 10;
  }, [getCartTotal]);

  // Calculate grand total
  const getGrandTotal = useCallback((): number => {
    return getCartTotal() + getTax() + getShipping();
  }, [getCartTotal, getTax, getShipping]);

  const calculateSubtotal = (): number => {
    return cartItems?.reduce((sum, item) => sum + item?.price * item?.quantity, 0);
  };

  const calculateTax = (): number => {
    return calculateSubtotal() * 0.08;
  };

  const calculateShipping = (): number => {
    return calculateSubtotal() > 50 ? 0 : 9.99;
  };

  const calculateDiscount = (): number => {
    if (!appliedCoupon) return 0;

    const subtotal = calculateSubtotal();
    if (appliedCoupon === 'SAVE10' && subtotal > 100) return subtotal * 0.1;
    if (appliedCoupon === 'SAVE20' && subtotal > 200) return subtotal * 0.2;
    if (appliedCoupon === 'FREESHIP') return calculateShipping();

    return 0;
  };

  const calculateTotal = (): number => {
    return calculateSubtotal() + calculateTax() + calculateShipping() - calculateDiscount();
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(cartItems?.map((item) => item?.id === itemId ? { ...item, quantity: Math.max(1, newQuantity) } : item));
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems?.filter((item) => item?.id !== itemId));
  };

  const handleApplyCoupon = (): void | undefined => {
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
    
    // React Query data and states
    categories,
    products,
    isCategoriesLoading,
    isProductsLoading,
    categoriesError,
    productsError,
    refetchCategories,
    refetchProducts,
    
    // Product count
    productCount,
    setProductCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
