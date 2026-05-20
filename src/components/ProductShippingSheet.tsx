import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRightIcon,
  DeliveryFilledIcon,
  DeliveryIcon,
  GlobeIcon,
  LocationIcon,
  XIcon,
} from '@shopify/polaris-icons';
import usFlag from '../assets/us-flag.png';
import {
  formatRateDescription,
  formatRatePrice,
  getProductShippingSummary,
} from '../lib/productShipping';
import type { ShippingRate } from '../lib/shippingRates';
import { PolarisIcon } from './PolarisIcon';
import './ProductShippingSheet.css';

type ProductShippingSheetProps = {
  open: boolean;
  onClose: () => void;
};

function getRateIcon(id: string) {
  return id === 'domestic-express' ? DeliveryFilledIcon : DeliveryIcon;
}

function ReadOnlyRateRow({ rate }: { rate: ShippingRate }) {
  return (
    <div className="product-shipping-sheet__rate-row">
      <PolarisIcon source={getRateIcon(rate.id)} className="product-shipping-sheet__icon--24" />
      <div className="product-shipping-sheet__rate-copy">
        <p className="product-shipping-sheet__rate-title">{rate.name}</p>
        <p className="product-shipping-sheet__rate-desc">{formatRateDescription(rate)}</p>
        <span className="product-shipping-sheet__badge">{formatRatePrice(rate)}</span>
      </div>
    </div>
  );
}

export function ProductShippingSheet({ open, onClose }: ProductShippingSheetProps) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(open);
  const [summary, setSummary] = useState(() => getProductShippingSummary());

  useEffect(() => {
    if (open) {
      setVisible(true);
      setSummary(getProductShippingSummary());
    }
  }, [open]);

  useEffect(() => {
    if (!open && visible) {
      const timer = window.setTimeout(() => setVisible(false), 280);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [open, visible]);

  if (!visible) return null;

  const handleReviewShipping = () => {
    onClose();
    navigate('/shop/shipping', { state: { returnTo: '/shop/product/add' } });
  };

  return (
    <div
      className={`product-shipping-sheet${open ? ' product-shipping-sheet--open' : ''}`}
      role="presentation"
    >
      <button
        type="button"
        className="product-shipping-sheet__backdrop"
        aria-label="Close shipping details"
        onClick={onClose}
      />
      <div
        className="product-shipping-sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-shipping-sheet-title"
      >
        <header className="product-shipping-sheet__header">
          <button type="button" className="product-shipping-sheet__close" onClick={onClose} aria-label="Close">
            <PolarisIcon source={XIcon} className="product-shipping-sheet__icon--20" />
          </button>
          <h2 id="product-shipping-sheet-title" className="product-shipping-sheet__title">
            Shipping
          </h2>
          <span className="product-shipping-sheet__header-spacer" aria-hidden />
        </header>

        <div className="product-shipping-sheet__scroll">
          <section className="product-shipping-sheet__section-panel">
            <div className="product-shipping-sheet__intro">
              <h3 className="product-shipping-sheet__heading">Store shipping</h3>
              <p className="product-shipping-sheet__subheading">
                This product uses the rates you confirmed in Shipping &amp; Delivery.
              </p>
            </div>

            <div className="product-shipping-sheet__block">
              <h4 className="product-shipping-sheet__block-label">Ships from</h4>
              <div className="product-shipping-sheet__location-card">
                <PolarisIcon source={LocationIcon} className="product-shipping-sheet__icon--20" />
                <div className="product-shipping-sheet__location-copy">
                  <p className="product-shipping-sheet__location-title">Shop location</p>
                  <p className="product-shipping-sheet__location-subtitle">{summary.locationLabel}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="product-shipping-sheet__section-panel">
            <div className="product-shipping-sheet__intro">
              <h3 className="product-shipping-sheet__heading">Shipping zones</h3>
              <p className="product-shipping-sheet__subheading">Rates applied at checkout for this product</p>
            </div>

            <div className="product-shipping-sheet__block">
              <h4 className="product-shipping-sheet__block-label">Domestic</h4>
              <div className="product-shipping-sheet__zone">
                <div className="product-shipping-sheet__zone-header">
                  <img src={usFlag} alt="" className="product-shipping-sheet__flag" />
                  <div className="product-shipping-sheet__zone-header-copy">
                    <p className="product-shipping-sheet__zone-title">Domestic</p>
                    <p className="product-shipping-sheet__zone-subtitle">United States</p>
                  </div>
                </div>
                {summary.domesticRates.map((rate, index) => (
                  <div
                    key={rate.id}
                    className={`product-shipping-sheet__rate-row-wrap${
                      index === summary.domesticRates.length - 1
                        ? ' product-shipping-sheet__rate-row-wrap--last'
                        : ''
                    }`}
                  >
                    <ReadOnlyRateRow rate={rate} />
                  </div>
                ))}
              </div>
            </div>

            <div className="product-shipping-sheet__block">
              <h4 className="product-shipping-sheet__block-label">International</h4>
              <div className="product-shipping-sheet__zone">
                <div className="product-shipping-sheet__zone-header">
                  <PolarisIcon source={GlobeIcon} className="product-shipping-sheet__icon--20" />
                  <div className="product-shipping-sheet__zone-header-copy">
                    <p className="product-shipping-sheet__zone-title">International</p>
                    <p className="product-shipping-sheet__zone-subtitle">
                      Canada, Mexico, United Kingdom, and 4 more
                    </p>
                  </div>
                </div>
                <div className="product-shipping-sheet__rate-row-wrap product-shipping-sheet__rate-row-wrap--last">
                  <ReadOnlyRateRow rate={summary.internationalRate} />
                </div>
              </div>
            </div>

            <button
              type="button"
              className="product-shipping-sheet__review-btn"
              onClick={handleReviewShipping}
            >
              Review shipping settings
              <PolarisIcon source={ChevronRightIcon} tone="subdued" className="product-shipping-sheet__icon--20" />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
