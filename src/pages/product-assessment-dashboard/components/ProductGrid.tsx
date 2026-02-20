import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, onProductClick }) => {
  const parentRef = useRef(null);
  const [columns, setColumns] = useState(4);

  // Calculate number of columns based on viewport width
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      let newColumns = 4;
      if (width < 768) {
        newColumns = 1; // mobile
      } else if (width < 1024) {
        newColumns = 2; // tablet
      } else if (width < 1280) {
        newColumns = 3; // desktop
      } else {
        newColumns = 4; // large desktop
      }
      
      if (newColumns !== columns) {
        setColumns(newColumns);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [columns]);

  // Calculate row count based on columns
  const rowCount = Math.ceil(products.length / columns);

  // Virtual row configuration with dynamic height measurement
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback((_index: number) => {
      // Calculate card width based on columns and gap
      // Approximate: (container width - gaps) / columns
      // Then calculate height: width * (4/3) for aspect-[3/4] + content (~120px)
      const containerWidth = parentRef.current?.offsetWidth || 1200;
      const gaps = columns > 1 ? (columns - 1) * 24 : 0; // 24px = gap-6
      const cardWidth = (containerWidth - gaps) / columns;
      const imageHeight = cardWidth * (4 / 3); // aspect-[3/4] = height is 4/3 of width
      const contentHeight = 120; // Approximate height for card content
      return imageHeight + contentHeight + 24; // +24 for gap between rows
    }, [columns]),
    overscan: 3, // Number of extra rows to render for smooth scrolling
    measureElement: typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
      ? (element) => element?.getBoundingClientRect().height
      : undefined,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="w-full overflow-auto scrollbar-thin"
      style={{ height: '70vh', minHeight: '500px' }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualRows.map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          const rowProducts = products.slice(startIndex, startIndex + columns);

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-1 py-2">
                {rowProducts.map((product) => (
                  <ProductCard
                    key={product?.id}
                    product={product}
                    onClick={onProductClick}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGrid;