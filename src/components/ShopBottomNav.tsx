import {
  HomeIcon,
  MenuIcon,
  OrderIcon,
  ProductIcon,
  SearchIcon,
  SidekickIcon,
} from '@shopify/polaris-icons';
import { useNavigate } from 'react-router-dom';
import { PolarisIcon } from './PolarisIcon';
import './ShopBottomNav.css';

type ShopBottomNavProps = {
  activeTab?: 'home' | 'orders' | 'products' | 'menu';
};

export function ShopBottomNav({ activeTab = 'home' }: ShopBottomNavProps) {
  const navigate = useNavigate();

  return (
    <nav className="shop-bottom-nav" aria-label="Main navigation">
      <button type="button" className="shop-bottom-nav__fab" aria-label="Search">
        <PolarisIcon source={SearchIcon} className="shop-bottom-nav__icon--24" />
      </button>
      <div className="shop-bottom-nav__pill">
        <button
          type="button"
          className={`shop-bottom-nav__item${activeTab === 'home' ? ' shop-bottom-nav__item--active' : ''}`}
          aria-label="Home"
          onClick={() => navigate('/shop/home')}
        >
          <PolarisIcon source={HomeIcon} className="shop-bottom-nav__icon--24" />
        </button>
        <button
          type="button"
          className={`shop-bottom-nav__item${activeTab === 'orders' ? ' shop-bottom-nav__item--active' : ''}`}
          aria-label="Orders"
        >
          <PolarisIcon source={OrderIcon} className="shop-bottom-nav__icon--24" />
        </button>
        <button
          type="button"
          className={`shop-bottom-nav__item${activeTab === 'products' ? ' shop-bottom-nav__item--active' : ''}`}
          aria-label="Products"
        >
          <PolarisIcon source={ProductIcon} className="shop-bottom-nav__icon--24" />
        </button>
        <button
          type="button"
          className={`shop-bottom-nav__item${activeTab === 'menu' ? ' shop-bottom-nav__item--active' : ''}`}
          aria-label="Menu"
        >
          <PolarisIcon source={MenuIcon} className="shop-bottom-nav__icon--24" />
        </button>
      </div>
      <button type="button" className="shop-bottom-nav__fab" aria-label="Sidekick">
        <PolarisIcon source={SidekickIcon} className="shop-bottom-nav__icon--24" />
      </button>
    </nav>
  );
}
