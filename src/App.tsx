import { Navigate, Route, Routes } from 'react-router-dom';
import { MenuIcon, SearchIcon } from '@shopify/polaris-icons';
import { EmailPage } from './pages/EmailPage';
import { ShopDashboardPage } from './pages/ShopDashboardPage';
import { ShopAddProductPage } from './pages/ShopAddProductPage';
import { ShopNotInTestPage } from './pages/ShopNotInTestPage';
import { ShopOrdersPage } from './pages/ShopOrdersPage';
import { ShopProductsPage } from './pages/ShopProductsPage';
import { ShopShippingPage } from './pages/ShopShippingPage';
import { ShopSetupPage } from './pages/ShopSetupPage';
import { ShopStylesPage } from './pages/ShopStylesPage';
import { StoreStartPage } from './pages/StoreStartPage';
import { WelcomePage } from './pages/WelcomePage';

export default function App() {
  return (
    <div className="device-frame">
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/email" element={<EmailPage />} />
        <Route path="/store-start" element={<StoreStartPage />} />
        <Route path="/shop/setup" element={<ShopSetupPage />} />
        <Route path="/shop/styles" element={<ShopStylesPage />} />
        <Route path="/shop/home" element={<ShopDashboardPage />} />
        <Route path="/shop/shipping" element={<ShopShippingPage />} />
        <Route path="/shop/orders" element={<ShopOrdersPage />} />
        <Route path="/shop/products" element={<ShopProductsPage />} />
        <Route path="/shop/product/add" element={<ShopAddProductPage />} />
        <Route
          path="/shop/search"
          element={<ShopNotInTestPage title="Search" icon={SearchIcon} />}
        />
        <Route
          path="/shop/menu"
          element={<ShopNotInTestPage title="Menu" icon={MenuIcon} activeTab="menu" />}
        />
        <Route path="/get-started" element={<Navigate to="/email?flow=signup" replace />} />
        <Route path="/log-in" element={<Navigate to="/email?flow=login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
