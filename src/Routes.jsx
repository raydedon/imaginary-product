import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import ProductAssessmentDashboard from './pages/product-assessment-dashboard';
import ProductDetailView from './pages/product-detail-view';
import UserAuthentication from './pages/user-authentication';
import ShoppingCartManagement from './pages/shopping-cart-management';
import Ebook from './pages/e-book';
import Library from './pages/library';
import { AssessmentProgressProvider } from './components/ui/AssessmentProgress';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <AssessmentProgressProvider>
      <ScrollToTop />
      <RouterRoutes>
        <Route path="/" element={<Navigate to="/product-assessment-dashboard" replace />} />
        <Route path="/product-assessment-dashboard" element={<ProductAssessmentDashboard />} />
        <Route path="/product-detail-view/:productId" element={<ProductDetailView />} />
        <Route path="/product-detail-view/:productId/" element={<ProductDetailView />} />
        <Route path="/product-detail-view" element={<Navigate to="/product-assessment-dashboard" replace />} />
        <Route path="/user-authentication" element={<UserAuthentication />} />
        <Route path="/shopping-cart-management" element={<ShoppingCartManagement />} />
        <Route path="/e-book" element={<Ebook />} />
        <Route path="/library" element={<Library />} />
        <Route path="*" element={<Navigate to="/product-assessment-dashboard" replace />} />
      </RouterRoutes>
      </AssessmentProgressProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;