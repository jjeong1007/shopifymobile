import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import shopAppIcon from '../assets/shop-app-icon.png';
import { setShopDownloadAcknowledged } from '../lib/shopStore';
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
    <div className="shop-download">
      <div className="shop-download__hero">
        <img alt="" className="shop-download__app-icon" src={shopAppIcon} />
      </div>

      <div className="shop-download__body">
        <p className="shop-download__eyebrow">Next part of your test</p>
        <h1 className="shop-download__title">Download the Shop app</h1>
        <p className="shop-download__desc">
          You&apos;ve finished setting up your store in this prototype. The next part of the user
          test moves to a different prototype focused on the <strong>Shop</strong> app experience.
        </p>

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

        <button
          type="button"
          className="shop-download__cta"
          onClick={() => navigate('/shop/app-loading')}
        >
          Download the Shop App
        </button>

        <button
          type="button"
          className="shop-download__back"
          onClick={() => navigate('/shop/home')}
        >
          Back to dashboard
        </button>
      </div>
    </div>
  );
}
