import { useEffect, useMemo } from 'react';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import {
  CheckCircleIcon,
  EditIcon,
  HomeIcon,
  MagicIcon,
  MenuIcon,
  NotificationIcon,
  OrderIcon,
  PackageIcon,
  PlusIcon,
  ProductIcon,
  SearchIcon,
  StoreIcon,
} from '@shopify/polaris-icons';
import { useNavigate } from 'react-router-dom';
import shopAppIcon from '../assets/shop-app-icon.png';
import { PolarisIcon } from '../components/PolarisIcon';
import { useBannerContrast } from '../hooks/useBannerContrast';
import {
  getBusinessName,
  getDisplayName,
  getInitials,
  getStoreTheme,
  isBannerUploaded,
  isLogoUploaded,
  STORE_BANNER_PLACEHOLDER,
  STORE_LOGO_PLACEHOLDER,
  THEME_BANNER_COLORS,
  THEME_STORE_LOGO_COLORS,
  THEME_STORE_LOGO_TEXT_COLORS,
} from '../lib/shopStore';
import '@shopify/polaris/build/esm/styles.css';
import './ShopDashboardPage.css';

export function ShopDashboardPage() {
  const navigate = useNavigate();
  const theme = getStoreTheme();
  const businessName = getBusinessName();
  const displayName = getDisplayName();
  const storeInitials = getInitials(businessName);
  const userInitials = getInitials(displayName);
  const hasLogoImage = isLogoUploaded();
  const hasBannerImage = isBannerUploaded();
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
                <img
                  src={STORE_LOGO_PLACEHOLDER}
                  alt=""
                  className="shop-dashboard__avatar shop-dashboard__avatar--store shop-dashboard__avatar--store-image"
                />
              ) : (
                <div
                  className="shop-dashboard__avatar shop-dashboard__avatar--store"
                  style={{
                    backgroundColor: THEME_STORE_LOGO_COLORS[theme],
                    color: THEME_STORE_LOGO_TEXT_COLORS[theme],
                  }}
                >
                  {storeInitials}
                </div>
              )}
              <div className="shop-dashboard__hero-actions">
                <button type="button" className="shop-dashboard__icon-btn" aria-label="Notifications">
                  <PolarisIcon source={NotificationIcon} className="shop-dashboard__icon--20" />
                </button>
                <button type="button" className="shop-dashboard__icon-btn" aria-label="Edit store">
                  <PolarisIcon source={EditIcon} className="shop-dashboard__icon--20" />
                </button>
                <div className="shop-dashboard__avatar shop-dashboard__avatar--user">{userInitials}</div>
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
            <button type="button" className="shop-dashboard__add-product">
              <PolarisIcon source={PlusIcon} tone="subdued" className="shop-dashboard__icon--20" />
              <span>Add a new product</span>
            </button>
          </section>

          <section className="shop-dashboard__section shop-dashboard__section--quick-actions">
            <h2 className="shop-dashboard__section-title">Quick Actions</h2>
            <div className="shop-dashboard__setup-card">
              <h3 className="shop-dashboard__setup-title">Let&apos;s setup your store</h3>
              <p className="shop-dashboard__setup-desc">
                Finish setting up your store so you can start selling on the Shop App instantly!
              </p>
              <div className="shop-dashboard__progress">
                <div className="shop-dashboard__progress-fill" />
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
                <button type="button" className="shop-dashboard__action-btn">
                  Review Shipping
                </button>
              </div>
              <div className="shop-dashboard__action-card">
                <img alt="" className="shop-dashboard__action-shop-icon" src={shopAppIcon} />
                <p className="shop-dashboard__action-title">Start selling on the Shop app</p>
                <button type="button" className="shop-dashboard__action-btn">Download Shop</button>
              </div>
              <div className="shop-dashboard__action-card">
                <PolarisIcon source={ProductIcon} className="shop-dashboard__icon--20" />
                <p className="shop-dashboard__action-title">
                  Upload products that you want to start selling.
                </p>
                <button type="button" className="shop-dashboard__action-btn">Add a product</button>
              </div>
            </div>
          </section>
        </div>

        <footer className="shop-dashboard__footer">
          <button type="button" className="shop-dashboard__download-cta">
            <img alt="" className="shop-dashboard__download-icon" src={shopAppIcon} />
            <span>Download Shop to start selling</span>
          </button>
        </footer>

        <nav className="shop-dashboard__nav" aria-label="Main navigation">
            <button type="button" className="shop-dashboard__nav-fab" aria-label="Search">
              <PolarisIcon source={SearchIcon} className="shop-dashboard__icon--24" />
            </button>
            <div className="shop-dashboard__nav-pill">
              <button
                type="button"
                className="shop-dashboard__nav-item shop-dashboard__nav-item--active"
                aria-label="Home"
              >
                <PolarisIcon source={HomeIcon} className="shop-dashboard__icon--24" />
              </button>
              <button type="button" className="shop-dashboard__nav-item" aria-label="Orders">
                <PolarisIcon source={OrderIcon} className="shop-dashboard__icon--24" />
              </button>
              <button type="button" className="shop-dashboard__nav-item" aria-label="Products">
                <PolarisIcon source={ProductIcon} className="shop-dashboard__icon--24" />
              </button>
              <button type="button" className="shop-dashboard__nav-item" aria-label="Menu">
                <PolarisIcon source={MenuIcon} className="shop-dashboard__icon--24" />
              </button>
            </div>
            <button type="button" className="shop-dashboard__nav-fab" aria-label="Assistant">
              <PolarisIcon source={MagicIcon} className="shop-dashboard__icon--24" />
            </button>
        </nav>
      </div>
    </AppProvider>
  );
}
