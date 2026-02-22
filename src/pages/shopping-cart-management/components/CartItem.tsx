import React, { useState, useCallback, useEffect } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useCart } from '../../../hooks/useCart';
import type { CartItem } from '../../../contexts/CartProvider';

interface CartItemProps {
  item: CartItem;
}

const CartItem = ({ item }: CartItemProps) => {
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const { handleUpdateQuantity, handleRemoveItem } = useCart();

  const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e?.target?.value) || 1;
    handleUpdateQuantity(item?.id, value);
  }, [item?.id, handleUpdateQuantity]);
  // Clear interval when the component unmounts or when intervalId changes
  useEffect(() => {
    return () => {
      if (intervalId) clearTimeout(intervalId);
    };
  }, [intervalId]);


  const startAutoIncrement = useCallback(() => {
    setIntervalId(setTimeout(function _fn(_id: string, quantity: number, setIntervalId: (id: NodeJS.Timeout | null) => void) {
      handleUpdateQuantity(_id, quantity);
      setIntervalId(setTimeout(_fn, 1000, _id, quantity + 1, setIntervalId));
    }, 1000, item?.id, item?.quantity + 1, setIntervalId));
  }, [handleUpdateQuantity, item?.id, item?.quantity]);

  const stopAutoIncrement = useCallback(() => {
    if (intervalId) {
      clearTimeout(intervalId);
      setIntervalId(null);
    }
  }, [intervalId]);
  const toggleAutoIncrement = useCallback(() => {
    if (intervalId) {
      stopAutoIncrement();
    }
    else {
      startAutoIncrement();
    }
  }, [intervalId, startAutoIncrement, stopAutoIncrement]);

  const subtotal = (item?.price * item?.quantity)?.toFixed(2) ?? '0.00';

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow duration-250">
      <div className="w-full md:w-32 lg:w-40 h-32 md:h-32 lg:h-40 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        <Image
          src={item?.images?.[0]?.url ?? ''}
          alt={item?.images?.[0]?.alt ?? ''}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 space-y-3 md:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg lg:text-xl font-semibold text-foreground line-clamp-2">
              {item?.title}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-1">
              {item?.category?.title ?? ''}
            </p>
          </div>
          <div className="text-right sm:text-left">
            <p className="text-lg md:text-xl lg:text-2xl font-bold text-primary whitespace-nowrap">
              ${item?.price?.toFixed(2) ?? '0.00'}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">per item</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Minus"
              onClick={() => handleUpdateQuantity(item?.id, Math.max(1, item?.quantity - 1))}
              disabled={item?.quantity <= 1}
            />
            <Input
              type="text"
              inputMode="numeric"
              value={item?.quantity}
              onChange={handleQuantityChange}
              className="w-16 md:w-20 text-center"
              min="1"
            />
            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              onClick={() => handleUpdateQuantity(item?.id, item?.quantity + 1)}
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            iconName="Zap"
            iconPosition="left"
            onClick={toggleAutoIncrement}
            className="text-warning"
          >
            {intervalId ? 'Stop' : 'Start'} Auto +1/sec
          </Button>


          <div className="flex items-center gap-2 sm:ml-auto">
            <span className="text-sm md:text-base text-muted-foreground">Subtotal:</span>
            <span className="text-lg md:text-xl font-bold text-foreground whitespace-nowrap">
              ${subtotal}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <Icon name="Truck" size={16} color="var(--color-success)" />
            <span>Free shipping on orders &gt; $50</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="Trash2"
            iconPosition="left"
            onClick={() => handleRemoveItem(item?.id)}
            className="text-error"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;