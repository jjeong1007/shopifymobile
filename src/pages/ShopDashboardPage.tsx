import { useEffect, useMemo, useState } from 'react';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import {
  CheckCircleIcon,
  EditIcon,
  NotificationIcon,
  PackageIcon,
  PaymentIcon,
  PlusIcon,
  ProductIcon,
  StoreIcon,
} from '@shopify/polaris-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import productMain from '../assets/placeholder-product-main.png';
import shopAppIcon from '../assets/shop-app-icon.png';
import { PolarisIcon } from '../components/PolarisIcon';
import { PrototypeNoticeDialog } from '../components/PrototypeNoticeDialog';
import { ShopBottomNav } from '../components/ShopBottomNav';
import { useBannerContrast } from '../hooks/useBannerContrast';
import {
  getBusinessName,
  getDisplayName,
  getInitials,
  getStoreSetupProgressPercent,
  getStoreTheme,
  isPaymentsConfirmed,
  isShippingConfirmed,
  isBannerUploaded,
  isLogoUploaded,
  STORE_BANNER_PLACEHOLDER,
  STORE_LOGO_PLACEHOLDER,
  THEME_BANNER_COLORS,
  THEME_STORE_LOGO_COLORS,
  THEME_STORE_LOGO_TEXT_COLORS,
} from '../lib/shopStore';
import {
  formatCatalogPrice,
  getCatalogProducts,
  type CatalogProduct,
} from '../lib/productCatalog';
import '@shopify/polaris/build/esm/styles.css';
import './ShopDashboardPage.css';

function ListingCard({ product }: { product: CatalogProduct }) {
  return (
    <div className="shop-dashboard__listing-card">
      <div className="shop-dashboard__listing-media">
        {product.hasImages ? (
          <img src={productMain} alt="" className="shop-dashboard__listing-img" />
        ) : (
          <span className="shop-dashboard__listing-placeholder" aria-hidden>
            <PolarisIcon source={ProductIcon} tone="subdued" className="shop-dashboard__icon--20" />
          </span>
        )}
      </div>
      <p className="shop-dashboard__listing-title">{product.title}</p>
      <p className="shop-dashboard__listing-price">{formatCatalogPrice(product.price)}</p>
    </div>
  );
}

export function ShopDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState(() => getCatalogProducts());
  const [noticeOpen, setNoticeOpen] = useState(false);
  const theme = getStoreTheme();
  const businessName = getBusinessName();
  const displayName = getDisplayName();
  const storeInitials = getInitials(businessName);
  const userInitials = getInitials(displayName);
  const hasLogoImage = isLogoUploaded();
  const hasBannerImage = isBannerUploaded();
  const shippingConfirmed = isShippingConfirmed();
  const paymentsConfirmed = isPaymentsConfirmed();
  const hasProducts = products.length > 0;
  const setupProgressPercent = getStoreSetupProgressPercent();
  const bannerColor = hasBannerImage ? null : THEME_BANNER_COLORS[theme];
  const bannerImageSrc = hasBannerImage ? STORE_BANNER_PLACEHOLDER : null;
  const bannerTone = useBannerContrast(bannerColor, bannerImageSrc);

  const heroClassName = useMemo(() => {
    const classes = ['shop-dashboard__hero'];
    if (hasBannerImage) classes.push('shop-dashboard__hero--has-banner-image');
    if (bannerTone) classes.push(`shop-dashboard__hero--bg-${bannerTone}`);
    return classes.join(' ');
  }, [hasBannerImage, bannerTone]);

  useEffect(() => {
    if (sessionStorage.getItem('shopify-prototype-store-type') !== 'shop') {
      navigate('/store-start', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    setProducts(getCatalogProducts());
  }, [location.key]);

  const heroStyle = hasBannerImage
    ? {
        backgroundImage: `url(${STORE_BANNER_PLACEHOLDER})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { backgroundColor: THEME_BANNER_COLORS[theme] };

  return (
    <AppProvider i18n={enTranslations}>
      <div className="shop-dashboard">
        <div className="shop-dashboard__scroll">
          <header className={heroClassName} style={heroStyle}>
            {hasBannerImage && bannerTone ? (
              <div className="shop-dashboard__hero-overlay" aria-hidden />
            ) : null}
            <div className="shop-dashboard__hero-top">
              {hasLogoImage ? (
                <button
                  type="button"
                  className="shop-dashboard__avatar shop-dashboard__avatar--store shop-dashboard__avatar--store-image"
                  aria-label="Store profile"
                  onClick={() => setNoticeOpen(true)}
                >
                  <img src={STORE_LOGO_PLACEHOLDER} alt="" />
                </button>
              ) : (
                <button
                  type="button"
                  className="shop-dashboard__avatar shop-dashboard__avatar--store"
                  aria-label="Store profile"
                  style={{
                    backgroundColor: THEME_STORE_LOGO_COLORS[theme],
                    color: THEME_STORE_LOGO_TEXT_COLORS[theme],
                  }}
                  onClick={() => setNoticeOpen(true)}
                >
                  {storeInitials}
                </button>
              )}
              <div className="shop-dashboard__hero-actions">
                <button
                  type="button"
                  className="shop-dashboard__icon-btn"
                  aria-label="Notifications"
                  onClick={() => setNoticeOpen(true)}
                >
                  <PolarisIcon source={NotificationIcon} className="shop-dashboard__icon--20" />
                </button>
                <button
                  type="button"
                  className="shop-dashboard__icon-btn"
                  aria-label="Edit store"
                  onClick={() => setNoticeOpen(true)}
                >
                  <PolarisIcon source={EditIcon} className="shop-dashboard__icon--20" />
                </button>
                <button
                  type="button"
                  className="shop-dashboard__avatar shop-dashboard__avatar--user"
                  aria-label="Account"
                  onClick={() => setNoticeOpen(true)}
                >
                  {userInitials}
                </button>
              </div>
            </div>
            <div className="shop-dashboard__hero-text">
              <h1 className="shop-dashboard__store-name">{businessName}</h1>
              <p className="shop-dashboard__welcome">Welcome to Your Store {displayName}</p>
            </div>
          </header>

          <div className="shop-dashboard__stats">
            <div className="shop-dashboard__stat">
              <span className="shop-dashboard__stat-label">TOTAL SALES</span>
              <span className="shop-dashboard__stat-value">0</span>
            </div>
            <div className="shop-dashboard__stat">
              <span className="shop-dashboard__stat-label">UNIQUE VISTORS</span>
              <span className="shop-dashboard__stat-value">0</span>
            </div>
            <div className="shop-dashboard__stat shop-dashboard__stat--muted">
              <span className="shop-dashboard__stat-label shop-dashboard__stat-label--live">
                <span className="shop-dashboard__live-dot" />
                LIVE SESSIONS
              </span>
              <span className="shop-dashboard__stat-value">0</span>
            </div>
          </div>

          <section className="shop-dashboard__section">
            <h2 className="shop-dashboard__section-title">Your Product Listings</h2>
            <div className="shop-dashboard__listings">
              {products.map((product) => (
                <ListingCard key={product.id} product={product} />
              ))}
              <button
                type="button"
                className="shop-dashboard__add-product"
                onClick={() => navigate('/shop/product/add', { state: { returnTo: '/shop/home' } })}
              >
                <PolarisIcon source={PlusIcon} tone="subdued" className="shop-dashboard__icon--20" />
                <span>Add a new product</span>
              </button>
            </div>
          </section>

          <section className="shop-dashboard__section shop-dashboard__section--quick-actions">
            <h2 className="shop-dashboard__section-title">Quick Actions</h2>
            <div className="shop-dashboard__setup-card">
              <h3 className="shop-dashboard__setup-title">Let&apos;s setup your store</h3>
              <p className="shop-dashboard__setup-desc">
                Finish setting up your store so you can start selling on the Shop App instantly!
              </p>
              <div className="shop-dashboard__progress">
                <div
                  className="shop-dashboard__progress-fill"
                  style={{ width: `${setupProgressPercent}%` }}
                />
              </div>
            </div>

            <div className="shop-dashboard__actions-grid">
              <div className="shop-dashboard__action-card">
                <PolarisIcon source={StoreIcon} className="shop-dashboard__icon--20" />
                <p className="shop-dashboard__action-title">Edit the style of your Shop store</p>
                <PolarisIcon
                  source={CheckCircleIcon}
                  tone="emphasis"
                  className="shop-dashboard__icon--24"
                />
              </div>
              <div className="shop-dashboard__action-card">
                <PolarisIcon source={PackageIcon} className="shop-dashboard__icon--20" />
                <p className="shop-dashboard__action-title">Confirm your shipping details</p>
                {shippingConfirmed ? (
                  <PolarisIcon
                    source={CheckCircleIcon}
                    tone="emphasis"
                    className="shop-dashboard__icon--24"
                  />
                ) : (
                  <button
                    type="button"
                    className="shop-dashboard__action-btn"
                    onClick={() => navigate('/shop/shipping')}
                  >
                    Review Shipping
                  </button>
                )}
              </div>
              <div className="shop-dashboard__action-card">
                <PolarisIcon source={ProductIcon} className="shop-dashboard__icon--20" />
                <p className="shop-dashboard__action-title">
                  Upload products that you want to start selling.
                </p>
                {hasProducts ? (
                  <PolarisIcon
                    source={CheckCircleIcon}
                    tone="emphasis"
                    className="shop-dashboard__icon--24"
                  />
                ) : (
                  <button
                    type="button"
                    className="shop-dashboard__action-btn"
                    onClick={() => navigate('/shop/product/add', { state: { returnTo: '/shop/home' } })}
                  >
                    Add a product
                  </button>
                )}
              </div>
              {paymentsConfirmed ? (
                <div className="shop-dashboard__action-card">
                  <PolarisIcon source={PaymentIcon} className="shop-dashboard__icon--20" />
                  <p className="shop-dashboard__action-title">
                    Setup Shopify Payments to start selling
                  </p>
                  <PolarisIcon
                    source={CheckCircleIcon}
                    tone="emphasis"
                    className="shop-dashboard__icon--24"
                  />
                </div>
              ) : null}
              <div
                className={`shop-dashboard__action-card${paymentsConfirmed ? ' shop-dashboard__action-card--full-width' : ''}`}
              >
                <img alt="" className="shop-dashboard__action-shop-icon" src={shopAppIcon} />
                <p className="shop-dashboard__action-title">Start selling on the Shop app</p>
                <button
                  type="button"
                  className="shop-dashboard__action-btn"
                  onClick={() => navigate('/shop/download')}
                >
                  Download Shop
                </button>
              </div>
            </div>

            {!paymentsConfirmed ? (
              <div className="shop-dashboard__payments-card">
                <PolarisIcon source={ProductIcon} className="shop-dashboard__icon--20" />
                <p className="shop-dashboard__payments-title">
                  Setup Shopify Payments to start selling
                </p>
                <button
                  type="button"
                  className="shop-dashboard__payments-btn"
                  onClick={() => navigate('/shop/payments')}
                >
                  Setup Payments
                </button>
                <p className="shop-dashboard__payments-note">
                  *In order to start selling on the Shop app, you must first set up payments
                </p>
              </div>
            ) : null}
          </section>
        </div>

        <footer className="shop-dashboard__footer">
          <button
            type="button"
            className="shop-dashboard__download-cta"
            onClick={() => navigate('/shop/download')}
          >
            <img alt="" className="shop-dashboard__download-icon" src={shopAppIcon} />
            <span>Download Shop to start selling</span>
          </button>
        </footer>

        <ShopBottomNav activeTab="home" />

        <PrototypeNoticeDialog open={noticeOpen} onClose={() => setNoticeOpen(false)} />
      </div>
    </AppProvider>
  );
}
