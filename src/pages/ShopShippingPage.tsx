import { useEffect, useState } from 'react';
import { AppProvider, type IconSource } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import {
  DeliveryFilledIcon,
  DeliveryIcon,
  GlobeIcon,
  LocationIcon,
  MenuVerticalIcon,
  PlusCircleIcon,
  ChevronRightIcon,
} from '@shopify/polaris-icons';
import { useNavigate } from 'react-router-dom';
import usFlag from '../assets/us-flag.png';
import { PolarisIcon } from '../components/PolarisIcon';
import { ShopBottomNav } from '../components/ShopBottomNav';
import { ShopLocationSheet } from '../components/ShopLocationSheet';
import { ShopShippingRateSheet } from '../components/ShopShippingRateSheet';
import {
  formatShopLocationSubtitle,
  getShopLocation,
  type ShopLocation,
} from '../lib/shopLocation';
import {
  formatRateDescription,
  formatRatePrice,
  getDomesticShippingRates,
  getShippingRates,
  type ShippingRate,
} from '../lib/shippingRates';
import { setShippingConfirmed } from '../lib/shopStore';
import '@shopify/polaris/build/esm/styles.css';
import './ShopShippingPage.css';

function getRateIcon(id: string): IconSource {
  if (id === 'domestic-express') return DeliveryFilledIcon;
  return DeliveryIcon;
}

function PriceBadge({ amount }: { amount: string }) {
  return <span className="shop-shipping__badge">{amount}</span>;
}

function ShippingRateRow({
  rate,
  onEdit,
}: {
  rate: ShippingRate;
  onEdit: (id: string) => void;
}) {
  return (
    <div className="shop-shipping__rate-row">
      <button
        type="button"
        className="shop-shipping__rate-main-btn"
        onClick={() => onEdit(rate.id)}
      >
        <PolarisIcon source={getRateIcon(rate.id)} className="shop-shipping__icon--24" />
        <div className="shop-shipping__rate-copy">
          <p className="shop-shipping__rate-title">{rate.name}</p>
          <p className="shop-shipping__rate-desc">{formatRateDescription(rate)}</p>
          <PriceBadge amount={formatRatePrice(rate)} />
        </div>
      </button>
      <button
        type="button"
        className="shop-shipping__menu-btn"
        aria-label={`Edit ${rate.name} shipping`}
        onClick={() => onEdit(rate.id)}
      >
        <PolarisIcon source={MenuVerticalIcon} className="shop-shipping__icon--20" />
      </button>
    </div>
  );
}

export function ShopShippingPage() {
  const navigate = useNavigate();
  const [shopLocation, setShopLocationState] = useState<ShopLocation>(() => getShopLocation());
  const [domesticRates, setDomesticRates] = useState(() => getDomesticShippingRates());
  const [rates, setRates] = useState(() => getShippingRates());
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);
  const [rateSheetMode, setRateSheetMode] = useState<'add' | 'edit' | null>(null);
  const [editingRateId, setEditingRateId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('shopify-prototype-store-type') !== 'shop') {
      navigate('/store-start', { replace: true });
    }
  }, [navigate]);

  const goHome = () => navigate('/shop/home');

  const handleSave = () => {
    setShippingConfirmed(true);
    navigate('/shop/home');
  };

  const closeRateSheet = () => {
    setRateSheetMode(null);
    setEditingRateId(null);
  };

  const openRateEditor = (id: string) => {
    setLocationSheetOpen(false);
    setRateSheetMode('edit');
    setEditingRateId(id);
  };

  const openAddRate = () => {
    setLocationSheetOpen(false);
    setRateSheetMode('add');
    setEditingRateId(null);
  };

  const refreshRates = () => {
    setDomesticRates(getDomesticShippingRates());
    setRates(getShippingRates());
  };

  const handleRateSaved = () => {
    refreshRates();
  };

  return (
    <AppProvider i18n={enTranslations}>
      <div className="shop-shipping">
        <header className="shop-shipping__topbar">
          <button type="button" className="shop-shipping__topbar-btn" onClick={goHome}>
            Cancel
          </button>
          <h1 className="shop-shipping__topbar-title">Shipping &amp; Delivery</h1>
          <button type="button" className="shop-shipping__topbar-btn shop-shipping__topbar-btn--save" onClick={handleSave}>
            Save
          </button>
        </header>

        <div className="shop-shipping__scroll">
          <section className="shop-shipping__panel">
            <div className="shop-shipping__intro">
              <h2 className="shop-shipping__heading">Confirm Shipping Details</h2>
              <p className="shop-shipping__subheading">Manage how you ship orders to your customers</p>
            </div>

            <div className="shop-shipping__block">
              <h3 className="shop-shipping__label">Your Store Location</h3>
              <button
                type="button"
                className="shop-shipping__location-card"
                onClick={() => {
                  closeRateSheet();
                  setLocationSheetOpen(true);
                }}
              >
                <PolarisIcon source={LocationIcon} className="shop-shipping__icon--20" />
                <div className="shop-shipping__location-copy">
                  <p className="shop-shipping__location-title">Shop location</p>
                  <p className="shop-shipping__location-subtitle">
                    {formatShopLocationSubtitle(shopLocation)}
                  </p>
                </div>
                <PolarisIcon
                  source={ChevronRightIcon}
                  tone="subdued"
                  className="shop-shipping__location-chevron"
                />
              </button>
            </div>
          </section>

          <section className="shop-shipping__panel">
            <div className="shop-shipping__intro">
              <h2 className="shop-shipping__heading">Shipping Zones</h2>
              <p className="shop-shipping__subheading">How do these shipping rates look?</p>
            </div>

            <div className="shop-shipping__block">
              <h3 className="shop-shipping__label">Your Store Location</h3>
              <div className="shop-shipping__zone">
                <div className="shop-shipping__zone-header">
                  <img src={usFlag} alt="" className="shop-shipping__flag" />
                  <div className="shop-shipping__zone-header-copy">
                    <p className="shop-shipping__zone-title">Domestic</p>
                    <p className="shop-shipping__zone-subtitle">{shopLocation.country}</p>
                  </div>
                </div>
                {domesticRates.map((rate) => (
                  <ShippingRateRow key={rate.id} rate={rate} onEdit={openRateEditor} />
                ))}
                <button type="button" className="shop-shipping__add-row" onClick={openAddRate}>
                  <PolarisIcon source={PlusCircleIcon} className="shop-shipping__icon--20" />
                  <span>Add a shipping option</span>
                </button>
              </div>
            </div>

            <div className="shop-shipping__block">
              <h3 className="shop-shipping__label">International</h3>
              <div className="shop-shipping__zone">
                <div className="shop-shipping__zone-header">
                  <PolarisIcon source={GlobeIcon} className="shop-shipping__icon--20" />
                  <div className="shop-shipping__zone-header-copy">
                    <p className="shop-shipping__zone-title">International</p>
                    <p className="shop-shipping__zone-subtitle">
                      Canada, Mexico, United Kingdom, and 4 more
                    </p>
                  </div>
                </div>
                <ShippingRateRow
                  rate={rates['international-standard']}
                  onEdit={openRateEditor}
                />
              </div>
            </div>
          </section>
        </div>

        <ShopBottomNav activeTab="home" />

        <ShopLocationSheet
          open={locationSheetOpen}
          onClose={() => setLocationSheetOpen(false)}
          onSave={setShopLocationState}
        />

        <ShopShippingRateSheet
          open={rateSheetMode !== null}
          mode={rateSheetMode === 'add' ? 'add' : 'edit'}
          rateId={editingRateId}
          onClose={closeRateSheet}
          onSave={handleRateSaved}
          onDelete={refreshRates}
        />
      </div>
    </AppProvider>
  );
}
