import {
  HomeFilledIcon,
  HomeIcon,
  MenuIcon,
  OrderFilledIcon,
  OrderIcon,
  ProductFilledIcon,
  ProductIcon,
  SearchIcon,
  SidekickIcon,
} from '@shopify/polaris-icons';
import { useNavigate } from 'react-router-dom';
import type { IconSource } from '@shopify/polaris';
import { PolarisIcon } from './PolarisIcon';
import './ShopBottomNav.css';

type ShopBottomNavProps = {
  activeTab?: 'home' | 'orders' | 'products' | 'menu';
};

type NavItem = {
  id: NonNullable<ShopBottomNavProps['activeTab']>;
  label: string;
  path: string;
  icon: IconSource;
  activeIcon: IconSource;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', path: '/shop/home', icon: HomeIcon, activeIcon: HomeFilledIcon },
  { id: 'orders', label: 'Orders', path: '/shop/orders', icon: OrderIcon, activeIcon: OrderFilledIcon },
  {
    id: 'products',
    label: 'Products',
    path: '/shop/products',
    icon: ProductIcon,
    activeIcon: ProductFilledIcon,
  },
  { id: 'menu', label: 'Menu', path: '/shop/menu', icon: MenuIcon, activeIcon: MenuIcon },
];

export function ShopBottomNav({ activeTab = 'home' }: ShopBottomNavProps) {
  const navigate = useNavigate();

  return (
    <nav className="shop-bottom-nav" aria-label="Main navigation">
      <button
        type="button"
        className="shop-bottom-nav__fab"
        aria-label="Search"
        onClick={() => navigate('/shop/search')}
      >
        <PolarisIcon source={SearchIcon} className="shop-bottom-nav__icon--24" />
      </button>
      <div className="shop-bottom-nav__pill">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`shop-bottom-nav__item${isActive ? ' shop-bottom-nav__item--active' : ''}`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => navigate(item.path)}
            >
              <PolarisIcon
                source={isActive ? item.activeIcon : item.icon}
                tone={isActive ? 'emphasis' : 'base'}
                className="shop-bottom-nav__icon--24"
              />
            </button>
          );
        })}
      </div>
      <button type="button" className="shop-bottom-nav__fab" aria-label="Sidekick">
        <PolarisIcon source={SidekickIcon} className="shop-bottom-nav__icon--24" />
      </button>
    </nav>
  );
}
