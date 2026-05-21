import { useEffect, useMemo } from 'react';
import {
  ChevronLeftIcon,
  HomeFilledIcon,
  OrderIcon,
  PlusIcon,
  SearchIcon,
} from '@shopify/polaris-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import acornNecklaceProduct from '../assets/acorn-necklace-product.png';
import { PolarisIcon } from '../components/PolarisIcon';
import { formatCatalogPrice, getCatalogProducts } from '../lib/productCatalog';
import {
  getBusinessName,
  getDisplayName,
  getInitials,
  getStoreTheme,
  THEME_STORE_LOGO_COLORS,
  THEME_STORE_LOGO_TEXT_COLORS,
} from '../lib/shopStore';
import './ShopAppProfilePage.css';

/** Figma node 430:749 — Shop App storefront profile (390×844) */

type ProfileProduct = {
  id: string;
  title: string;
  price: string;
  rating: number;
  reviewCount: number;
  showViews: boolean;
};

function getProfileProducts(): ProfileProduct[] {
  const catalog = getCatalogProducts();
  if (catalog.length > 0) {
    return catalog.slice(0, 4).map((product, index) => ({
      id: product.id,
      title: product.title,
      price: formatCatalogPrice(product.price),
      rating: 4,
      reviewCount: 12,
      showViews: index < 2,
    }));
  }

  return Array.from({ length: 4 }, (_, index) => ({
    id: `demo-${index}`,
    title: 'Acorn Necklace',
    price: '$49.99',
    rating: 4,
    reviewCount: 12,
    showViews: index < 2,
  }));
}

function ViewIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M1.75 7s2.333-3.5 5.25-3.5 5.25 3.5 5.25 3.5-2.333 3.5-5.25 3.5S1.75 7 1.75 7Z"
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="7" r="1.75" stroke="#ffffff" strokeWidth="1.2" />
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 1.6l1.76 3.57 3.94.57-2.85 2.78.67 3.92L8 10.47l-3.52 1.85.67-3.92L2.3 5.74l3.94-.57L8 1.6Z"
        fill={filled ? '#000000' : 'none'}
        stroke="#000000"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="5" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="13" y="5" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="5" y="13" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="13" y="13" width="6" height="6" rx="1.5" fill="#000000" />
    </svg>
  );
}

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="shop-app-profile__rating">
      <div className="shop-app-profile__stars" aria-hidden>
        {Array.from({ length: 5 }, (_, index) => (
          <StarIcon key={index} filled={index < rating} />
        ))}
      </div>
      <span className="shop-app-profile__review-count">({reviewCount})</span>
    </div>
  );
}

function ProductCard({ product }: { product: ProfileProduct }) {
  return (
    <article className="shop-app-profile__product">
      <div className="shop-app-profile__product-media">
        <img alt="" className="shop-app-profile__product-img" src={acornNecklaceProduct} />
        {product.showViews ? (
          <div className="shop-app-profile__views">
            <ViewIcon />
            <span>1k</span>
          </div>
        ) : null}
      </div>
      <div className="shop-app-profile__product-copy">
        <p className="shop-app-profile__product-title">{product.title}</p>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        <p className="shop-app-profile__product-price">{product.price}</p>
      </div>
    </article>
  );
}

export function ShopAppProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = getStoreTheme();
  const businessName = getBusinessName();
  const storeInitials = getInitials(businessName);
  const userInitials = getInitials(getDisplayName());
  const products = useMemo(() => getProfileProducts(), [location.key]);

  useEffect(() => {
    if (sessionStorage.getItem('shopify-prototype-store-type') !== 'shop') {
      navigate('/store-start', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="shop-app-profile">
      <header className="shop-app-profile__header">
        <div
          className="shop-app-profile__store-avatar"
          style={{
            backgroundColor: THEME_STORE_LOGO_COLORS[theme],
            color: THEME_STORE_LOGO_TEXT_COLORS[theme],
          }}
        >
          {storeInitials}
        </div>
        <h1 className="shop-app-profile__title">Your Storefront</h1>
        <div className="shop-app-profile__user-avatar">{userInitials}</div>
      </header>

      <div className="shop-app-profile__scroll">
        <div className="shop-app-profile__stats">
          <div className="shop-app-profile__stat">
            <p className="shop-app-profile__stat-label">Followers</p>
            <p className="shop-app-profile__stat-value">0</p>
          </div>
          <div className="shop-app-profile__stat">
            <p className="shop-app-profile__stat-label">Following</p>
            <p className="shop-app-profile__stat-value">0</p>
          </div>
          <div className="shop-app-profile__stat">
            <p className="shop-app-profile__stat-label">Shop Reviews</p>
            <div className="shop-app-profile__stat-reviews">
              <StarIcon filled />
              <span className="shop-app-profile__stat-score">0.0</span>
              <span className="shop-app-profile__stat-score-max">/ 5.0</span>
            </div>
          </div>
        </div>

        <h2 className="shop-app-profile__store-name">{businessName}</h2>

        <button type="button" className="shop-app-profile__add-category">
          <PolarisIcon source={PlusIcon} className="shop-app-profile__icon--16" />
          <span>Add Category</span>
        </button>

        <h3 className="shop-app-profile__section-title">All Products</h3>

        <div className="shop-app-profile__products">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <footer className="shop-app-profile__footer">
        <button
          type="button"
          className="shop-app-profile__back"
          aria-label="Back to home"
          onClick={() => navigate('/shop/app/home')}
        >
          <PolarisIcon source={ChevronLeftIcon} className="shop-app-profile__icon--24" />
        </button>

        <nav className="shop-app-profile__nav" aria-label="Shop app navigation">
          <button type="button" className="shop-app-profile__nav-item shop-app-profile__nav-item--active">
            <PolarisIcon source={HomeFilledIcon} tone="emphasis" className="shop-app-profile__icon--24" />
          </button>
          <button type="button" className="shop-app-profile__nav-item" aria-label="Search">
            <PolarisIcon source={SearchIcon} className="shop-app-profile__icon--24" />
          </button>
          <button type="button" className="shop-app-profile__nav-item" aria-label="Categories">
            <GridIcon />
          </button>
          <button type="button" className="shop-app-profile__nav-item" aria-label="Orders">
            <PolarisIcon source={OrderIcon} className="shop-app-profile__icon--24" />
          </button>
        </nav>
      </footer>
    </div>
  );
}
