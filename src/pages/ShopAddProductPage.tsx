import { useEffect, useState } from 'react';
import { AppProvider, type IconSource } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import {
  ChevronRightIcon,
  DeliveryIcon,
  GlobeIcon,
  ImageAddIcon,
  LocationIcon,
  PlusCircleIcon,
} from '@shopify/polaris-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import productMain from '../assets/placeholder-product-main.png';
import { ProductCategorySheet } from '../components/ProductCategorySheet';
import { ProductDescriptionSheet } from '../components/ProductDescriptionSheet';
import { ProductShippingSheet } from '../components/ProductShippingSheet';
import { PolarisIcon } from '../components/PolarisIcon';
import { PrototypeNoticeDialog } from '../components/PrototypeNoticeDialog';
import { ShopBottomNav } from '../components/ShopBottomNav';
import {
  getProductCategory,
  getProductCategoryLabel,
  getProductDescription,
  truncateText,
} from '../lib/productDraft';
import { saveCatalogProduct } from '../lib/productCatalog';
import { getProductShippingSummary, type ProductShippingSummary } from '../lib/productShipping';
import '@shopify/polaris/build/esm/styles.css';
import './ShopAddProductPage.css';

/** Silver Makers — one product (sterling signet ring), four gallery crops */
const PRODUCT_GALLERY_VIEWS = [
  { id: 'front', position: '50% 45%' },
  { id: 'angle-left', position: '28% 50%' },
  { id: 'angle-right', position: '72% 50%' },
  { id: 'detail', position: '50% 68%' },
] as const;

function DetailRow({
  icon,
  emptyLabel,
  fieldLabel,
  value,
  onClick,
}: {
  icon: IconSource;
  emptyLabel: string;
  fieldLabel: string;
  value?: string;
  onClick?: () => void;
}) {
  const hasValue = Boolean(value?.trim());

  return (
    <button type="button" className="add-product__row" onClick={onClick}>
      <span className="add-product__row-left">
        {!hasValue ? (
          <PolarisIcon source={icon} className="add-product__icon--20" />
        ) : null}
        {hasValue ? (
          <span className="add-product__row-text">
            <span className="add-product__row-sublabel">{fieldLabel}</span>
            <span className="add-product__row-value">{value}</span>
          </span>
        ) : (
          <span className="add-product__row-label">{emptyLabel}</span>
        )}
      </span>
      <PolarisIcon source={ChevronRightIcon} tone="subdued" className="add-product__icon--20" />
    </button>
  );
}

function ProductShippingSection({
  summary,
  onClick,
}: {
  summary: ProductShippingSummary;
  onClick: () => void;
}) {
  if (!summary.confirmed) {
    return (
      <section className="add-product__shipping">
        <h3 className="add-product__shipping-label">Shipping</h3>
        <button type="button" className="add-product__shipping-setup" onClick={onClick}>
          <span className="add-product__shipping-setup-icon">
            <PolarisIcon source={DeliveryIcon} className="add-product__icon--20" />
          </span>
          <span className="add-product__shipping-setup-copy">
            <span className="add-product__shipping-setup-title">Review shipping</span>
            <span className="add-product__shipping-setup-desc">
              Confirm your store shipping rates before adding a physical product.
            </span>
          </span>
          <PolarisIcon source={ChevronRightIcon} tone="subdued" className="add-product__icon--20" />
        </button>
      </section>
    );
  }

  return (
    <section className="add-product__shipping">
      <h3 className="add-product__shipping-label">Shipping</h3>
      <button type="button" className="add-product__shipping-card" onClick={onClick}>
        <div className="add-product__shipping-card-top">
          <span className="add-product__shipping-card-badge">Store rates</span>
          <PolarisIcon source={ChevronRightIcon} tone="subdued" className="add-product__icon--20" />
        </div>

        <div className="add-product__shipping-origin">
          <PolarisIcon source={LocationIcon} className="add-product__icon--20" />
          <span className="add-product__shipping-origin-text">
            Ships from <strong>{summary.locationLabel}</strong>
          </span>
        </div>

        <div className="add-product__shipping-zones">
          <div className="add-product__shipping-zone">
            <PolarisIcon source={DeliveryIcon} className="add-product__icon--20" />
            <div className="add-product__shipping-zone-copy">
              <span className="add-product__shipping-zone-name">Domestic</span>
              <span className="add-product__shipping-zone-meta">
                {summary.domesticCount} {summary.domesticCount === 1 ? 'rate' : 'rates'}
              </span>
            </div>
          </div>
          <div className="add-product__shipping-zone">
            <PolarisIcon source={GlobeIcon} className="add-product__icon--20" />
            <div className="add-product__shipping-zone-copy">
              <span className="add-product__shipping-zone-name">International</span>
              <span className="add-product__shipping-zone-meta">{summary.internationalPrice}</span>
            </div>
          </div>
        </div>
      </button>
    </section>
  );
}

type AddProductNavState = { returnTo?: string };

export function ShopAddProductPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as AddProductNavState | null)?.returnTo ?? '/shop/home';
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [hasProductImages, setHasProductImages] = useState(false);
  const [description, setDescription] = useState(() => getProductDescription());
  const [category, setCategory] = useState(() => getProductCategory());
  const [shippingSummary, setShippingSummary] = useState(() => getProductShippingSummary());
  const [descriptionSheetOpen, setDescriptionSheetOpen] = useState(false);
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [shippingSheetOpen, setShippingSheetOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('shopify-prototype-store-type') !== 'shop') {
      navigate('/store-start', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    setShippingSummary(getProductShippingSummary());
  }, [location.key]);

  const goBack = () => navigate(returnTo);

  const handleSave = () => {
    const productTitle = title.trim() || 'Untitled product';
    saveCatalogProduct({
      title: productTitle,
      price: price.trim(),
      hasImages: hasProductImages,
      description: description.trim(),
      categoryPath: category,
    });
    navigate('/shop/products');
  };

  const handleAddImages = () => {
    setHasProductImages(true);
  };

  const handleShippingClick = () => {
    if (shippingSummary.confirmed) {
      setShippingSheetOpen(true);
      return;
    }
    navigate('/shop/shipping', { state: { returnTo: '/shop/product/add' } });
  };

  return (
    <AppProvider i18n={enTranslations}>
      <div className="add-product">
        <header className="add-product__topbar">
          <button type="button" className="add-product__topbar-btn" onClick={goBack}>
            Cancel
          </button>
          <button type="button" className="add-product__topbar-btn add-product__topbar-btn--save" onClick={handleSave}>
            Save
          </button>
        </header>

        <div className="add-product__scroll">
          <div className="add-product__images">
            {hasProductImages ? (
              <div className="add-product__gallery" aria-label="Product images">
                {PRODUCT_GALLERY_VIEWS.map((view) => (
                  <img
                    key={view.id}
                    src={productMain}
                    alt=""
                    className="add-product__gallery-img"
                    style={{ objectPosition: view.position }}
                  />
                ))}
              </div>
            ) : null}
            {!hasProductImages ? (
              <button type="button" className="add-product__image-zone" onClick={handleAddImages}>
                <PolarisIcon source={ImageAddIcon} tone="interactive" className="add-product__icon--20" />
                <span className="add-product__image-label">Add images</span>
              </button>
            ) : null}
          </div>

          <label className="add-product__title-field">
            <span className="visually-hidden">Product title</span>
            <input
              className="add-product__title-input"
              type="text"
              placeholder="Product title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <div className="add-product__details">
            <DetailRow
              icon={PlusCircleIcon}
              emptyLabel="Add description"
              fieldLabel="Description"
              value={description ? truncateText(description) : undefined}
              onClick={() => setDescriptionSheetOpen(true)}
            />
            <DetailRow
              icon={PlusCircleIcon}
              emptyLabel="Category"
              fieldLabel="Category"
              value={category ? getProductCategoryLabel(category) : undefined}
              onClick={() => setCategorySheetOpen(true)}
            />

            <div className="add-product__price-block">
              <label className="add-product__field">
                <span className="add-product__field-label">Price</span>
                <span className="add-product__price-wrap">
                  <span className="add-product__price-prefix">$</span>
                  <input
                    className="add-product__price-input"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))}
                  />
                </span>
              </label>
              <button
                type="button"
                className="add-product__discount-btn"
                onClick={() => setNoticeOpen(true)}
              >
                Create Discount
              </button>
            </div>

            <ProductShippingSection summary={shippingSummary} onClick={handleShippingClick} />
          </div>
        </div>

        <ProductDescriptionSheet
          open={descriptionSheetOpen}
          onClose={() => setDescriptionSheetOpen(false)}
          onSave={setDescription}
        />
        <ProductCategorySheet
          open={categorySheetOpen}
          onClose={() => setCategorySheetOpen(false)}
          onSave={setCategory}
        />
        <ProductShippingSheet
          open={shippingSheetOpen}
          onClose={() => {
            setShippingSheetOpen(false);
            setShippingSummary(getProductShippingSummary());
          }}
        />

        <ShopBottomNav activeTab="home" />

        <PrototypeNoticeDialog open={noticeOpen} onClose={() => setNoticeOpen(false)} />
      </div>
    </AppProvider>
  );
}
