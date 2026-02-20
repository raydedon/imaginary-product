import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import PerformanceMonitor from '../../components/ui/PerformanceMonitor';
import FilterToolbar from './components/FilterToolbar';
import ProductGrid from './components/ProductGrid';
import Icon from '../../components/AppIcon';
import { useCart } from '../../hooks/useCart';

const ProductAssessmentDashboard = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    minPrice: null,
    maxPrice: null
  });
  const { products, categories, setProductCount, productCount, setSelectedProductId: _setSelectedProductId } = useCart();

  const filteredProducts = useMemo(() => {
    return products?.filter(product => {
      const matchesSearch = product?.title?.toLowerCase()?.includes(filters?.search?.toLowerCase());
      const matchesCategory = filters?.category === 'all' || product?.category === filters?.category;
      const matchesMinPrice = filters?.minPrice === null || product?.price >= filters?.minPrice;
      const matchesMaxPrice = filters?.maxPrice === null || product?.price <= filters?.maxPrice;

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  }, [products, filters]);

  const handleProductClick = useCallback((product) => {
    navigate(`/product-detail-view/${product?.id}/`);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PerformanceMonitor />
      <main className="pt-[76px] px-4 md:px-6 lg:px-8 pb-8">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 mt-6">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Product Catalog
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label htmlFor="product-count" className="text-sm font-medium text-foreground whitespace-nowrap">
                  Products:
                </label>
                <input
                  id="product-count"
                  type="number"
                  min="1"
                  max="100000"
                  value={productCount}
                  onChange={(e) => setProductCount(Math.max(1, parseInt(e?.target?.value) || 50))}
                  className="w-24 px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-ring/10 border border-ring/20 rounded-md">
                <Icon name="AlertCircle" size={18} color="var(--color-ring)" />
                <span className="text-sm text-ring font-medium whitespace-nowrap">
                  {filteredProducts?.length?.toLocaleString()} items
                </span>
              </div>
            </div>
          </div>

          <FilterToolbar
            onFilterChange={setFilters}
            categories={categories}
            totalProducts={products?.length}
          />

          <div className="bg-card border border-border rounded-lg overflow-hidden sticky top-[92px] z-10">
            <div className="flex items-center justify-between p-4 md:p-6 pb-3 border-b border-border bg-card">
              <h2 className="text-lg md:text-xl font-semibold text-foreground">
                Product Catalog
              </h2>
              <span className="text-sm text-muted-foreground">
                Showing {filteredProducts?.length?.toLocaleString()} of {products?.length?.toLocaleString()}
              </span>
            </div>

            {filteredProducts?.length > 0 ? (
              <div className="p-4 md:p-6 pt-4">
                <ProductGrid
                  products={filteredProducts}
                  onProductClick={handleProductClick}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 md:py-16">
                <Icon name="PackageX" size={48} color="var(--color-muted)" />
                <p className="text-muted-foreground mt-4">No products found matching your filters</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductAssessmentDashboard;