import { Navigate, Route, Routes } from 'react-router-dom';
import { EmailPage } from './pages/EmailPage';
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
        <Route path="/get-started" element={<Navigate to="/email?flow=signup" replace />} />
        <Route path="/log-in" element={<Navigate to="/email?flow=login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
