import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import shopAppLoading from '../assets/shop-app-loading.png';
import './ShopAppLoadingPage.css';

/** Figma node 507:332 — Shop App splash / loading */
const LOADING_DURATION_MS = 2000;

export function ShopAppLoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('shopify-prototype-store-type') !== 'shop') {
      navigate('/store-start', { replace: true });
      return;
    }

    const timer = window.setTimeout(() => {
      navigate('/shop/app/home', { replace: true });
    }, LOADING_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="shop-app-loading">
      <img alt="" className="shop-app-loading__artwork" src={shopAppLoading} draggable={false} />
    </div>
  );
}
