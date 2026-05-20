import { useEffect } from 'react';
import { AppProvider, type IconSource } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import { useNavigate } from 'react-router-dom';
import { PolarisIcon } from '../components/PolarisIcon';
import { ShopBottomNav } from '../components/ShopBottomNav';
import '@shopify/polaris/build/esm/styles.css';
import './ShopNotInTestPage.css';

type ShopNotInTestPageProps = {
  title: string;
  icon: IconSource;
  activeTab?: 'home' | 'orders' | 'products' | 'menu';
};

export function ShopNotInTestPage({ title, icon, activeTab }: ShopNotInTestPageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('shopify-prototype-store-type') !== 'shop') {
      navigate('/store-start', { replace: true });
    }
  }, [navigate]);

  return (
    <AppProvider i18n={enTranslations}>
      <div className="shop-not-in-test">
        <header className="shop-not-in-test__header">
          <h1 className="shop-not-in-test__title">{title}</h1>
        </header>

        <div className="shop-not-in-test__content">
          <div className="shop-not-in-test__icon">
            <PolarisIcon source={icon} tone="subdued" className="shop-not-in-test__icon--24" />
          </div>
          <h2 className="shop-not-in-test__heading">Not part of this test</h2>
          <p className="shop-not-in-test__desc">
            This page is not necessary for the user testing you are currently doing. You can go back
            and continue with the main flows.
          </p>
        </div>

        <ShopBottomNav activeTab={activeTab} />
      </div>
    </AppProvider>
  );
}
