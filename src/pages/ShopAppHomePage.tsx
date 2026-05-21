import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import shopAppHome from '../assets/shop-app-home.png';
import './ShopAppHomePage.css';

/** Figma node 507:513 — Shop App home feed (390×844) */
const PROFILE_HIT = { top: 52, left: 12, width: 44, height: 44 };

export function ShopAppHomePage() {
  const navigate = useNavigate();
  const [profilePressed, setProfilePressed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('shopify-prototype-store-type') !== 'shop') {
      navigate('/store-start', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="shop-app-home">
      <img alt="" className="shop-app-home__artwork" src={shopAppHome} draggable={false} />
      <button
        type="button"
        aria-label="Your storefront profile"
        className={`shop-app-home__hit ${profilePressed ? 'shop-app-home__hit--pressed' : ''}`}
        style={PROFILE_HIT}
        onClick={() => navigate('/shop/app/profile')}
        onPointerDown={() => setProfilePressed(true)}
        onPointerUp={() => setProfilePressed(false)}
        onPointerLeave={() => setProfilePressed(false)}
      />
    </div>
  );
}
