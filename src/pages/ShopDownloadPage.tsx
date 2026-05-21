import { useEffect } from 'react';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import { useNavigate } from 'react-router-dom';
import shopAppIcon from '../assets/shop-app-icon.png';
import { ShopBottomNav } from '../components/ShopBottomNav';
import { setShopDownloadAcknowledged } from '../lib/shopStore';
import '@shopify/polaris/build/esm/styles.css';
import './ShopDownloadPage.css';

export function ShopDownloadPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('shopify-prototype-store-type') !== 'shop') {
      navigate('/store-start', { replace: true });
      return;
    }
    setShopDownloadAcknowledged(true);
  }, [navigate]);

  return (
    <AppProvider i18n={enTranslations}>
      <div className="shop-download">
        <header className="shop-download__topbar">
          <button type="button" className="shop-download__topbar-btn" onClick={() => navigate('/shop/home')}>
            Cancel
          </button>
          <h1 className="shop-download__topbar-title">Download Shop</h1>
          <span className="shop-download__topbar-spacer" aria-hidden />
        </header>

        <div className="shop-download__scroll">
          <section className="shop-download__main">
            <div className="shop-download__icon">
              <img alt="" className="shop-download__icon-img" src={shopAppIcon} />
            </div>
            <h2 className="shop-download__heading">Download the Shop app</h2>
            <p className="shop-download__desc">
              You&apos;ve finished setting up your store in this prototype. The next part of the user
              test moves to a different prototype focused on the Shop app experience.
            </p>
          </section>

          <section className="shop-download__steps-card">
            <h3 className="shop-download__steps-title">Next part of your test</h3>
            <ol className="shop-download__steps">
              <li>
                <span className="shop-download__step-num">1</span>
                <span>You&apos;ve completed store setup in this prototype</span>
              </li>
              <li>
                <span className="shop-download__step-num">2</span>
                <span>The next session uses a separate Shop app prototype</span>
              </li>
            </ol>
          </section>

          <button
            type="button"
            className="shop-download__cta"
            onClick={() => navigate('/shop/app-loading')}
          >
            <img alt="" className="shop-download__cta-icon" src={shopAppIcon} />
            <span>Download the Shop App</span>
          </button>
        </div>

        <ShopBottomNav activeTab="home" />
      </div>
    </AppProvider>
  );
}
