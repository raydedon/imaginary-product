import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import { fetchProductsByCategory } from '../../../utils/utils';

const RelatedProducts = ({ currentProductId, category }) => {
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const loadRelatedProducts = async () => {
      const fetchedProducts = await fetchProductsByCategory(category);
      setRelatedProducts(fetchedProducts?.filter((p) => p?.id !== currentProductId));
    };
    loadRelatedProducts();
  }, [currentProductId, category]);

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6">
        Related Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {relatedProducts?.map((product) =>
        <button
          key={product?.id}
          onClick={() => handleProductClick(product?.id)}
          className="group bg-muted rounded-lg overflow-hidden hover:shadow-lg transition-all duration-250 text-left">

            <div className="relative overflow-hidden">
              <Image
              src={product?.image}
              alt={product?.imageAlt ?? product?.title}
              className="w-full object-cover group-hover:scale-105 transition-transform duration-250" />

            </div>
            
            <div className="p-3 md:p-4">
              <h3 className="text-sm md:text-base font-medium text-foreground mb-2 line-clamp-2">
                {product?.name ?? product?.title}
              </h3>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)]?.map((_, i) =>
                <Icon
                  key={i}
                  name="Star"
                  size={12}
                  color={i < Math.floor(product?.rating) ? 'var(--color-warning)' : 'var(--color-muted)'}
                  className={i < Math.floor(product?.rating) ? 'fill-warning' : 'fill-muted'} />

                )}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({Math.floor(Math.random() * 1000) + 1})
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg md:text-xl font-bold text-foreground">
                  ${product?.price?.toFixed(2)}
                </span>
                <Icon name="ArrowRight" size={18} color="var(--color-primary)" />
              </div>
            </div>
          </button>
        )}
      </div>
    </div>);

};

export default RelatedProducts;