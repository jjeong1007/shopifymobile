import { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@shopify/polaris-icons';
import {
  formatShopLocationSummary,
  getShopLocation,
  SHOP_LOCATION_COUNTRIES,
  setShopLocation,
  type ShopLocation,
} from '../lib/shopLocation';
import { PolarisIcon } from './PolarisIcon';
import './ShopLocationSheet.css';

type ShopLocationSheetProps = {
  open: boolean;
  onClose: () => void;
  onSave: (location: ShopLocation) => void;
};

export function ShopLocationSheet({ open, onClose, onSave }: ShopLocationSheetProps) {
  const [visible, setVisible] = useState(open);
  const [form, setForm] = useState<ShopLocation>(() => getShopLocation());

  useEffect(() => {
    if (open) {
      setVisible(true);
      setForm(getShopLocation());
    }
  }, [open]);

  useEffect(() => {
    if (!open && visible) {
      const timer = window.setTimeout(() => setVisible(false), 280);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [open, visible]);

  const update = (patch: Partial<ShopLocation>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const handleDone = () => {
    setShopLocation(form);
    onSave(form);
    onClose();
  };

  if (!visible) return null;

  const canSave =
    form.country.trim().length > 0 &&
    form.addressLine1.trim().length > 0 &&
    form.city.trim().length > 0 &&
    form.state.trim().length > 0 &&
    form.postalCode.trim().length > 0;

  return (
    <div
      className={`shop-location-sheet${open ? ' shop-location-sheet--open' : ''}`}
      role="presentation"
    >
      <button
        type="button"
        className="shop-location-sheet__backdrop"
        aria-label="Close shop location"
        onClick={onClose}
      />
      <div
        className="shop-location-sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shop-location-sheet-title"
      >
        <div className="shop-location-sheet__handle" aria-hidden />

        <header className="shop-location-sheet__header">
          <button type="button" className="shop-location-sheet__header-btn" onClick={onClose}>
            Cancel
          </button>
          <h2 id="shop-location-sheet-title" className="shop-location-sheet__title">
            Shop location
          </h2>
          <button
            type="button"
            className="shop-location-sheet__header-btn shop-location-sheet__header-btn--done"
            onClick={handleDone}
            disabled={!canSave}
          >
            Done
          </button>
        </header>

        <div className="shop-location-sheet__body">
          <p className="shop-location-sheet__desc">
            Enter where you ship orders from. This helps calculate rates and delivery times.
          </p>

          <label className="shop-location-sheet__field">
            <span className="shop-location-sheet__label">Country/region</span>
            <span className="shop-location-sheet__select-wrap">
              <select
                className="shop-location-sheet__select"
                value={form.country}
                onChange={(e) => update({ country: e.target.value })}
              >
                {SHOP_LOCATION_COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <PolarisIcon
                source={ChevronDownIcon}
                className="shop-location-sheet__select-chevron"
              />
            </span>
          </label>

          <label className="shop-location-sheet__field">
            <span className="shop-location-sheet__label">Address</span>
            <input
              className="shop-location-sheet__input"
              type="text"
              placeholder="Street address"
              value={form.addressLine1}
              onChange={(e) => update({ addressLine1: e.target.value })}
              autoComplete="address-line1"
            />
          </label>

          <label className="shop-location-sheet__field">
            <span className="shop-location-sheet__label">Apartment, suite, etc. (optional)</span>
            <input
              className="shop-location-sheet__input"
              type="text"
              placeholder="Apartment, suite, unit"
              value={form.addressLine2}
              onChange={(e) => update({ addressLine2: e.target.value })}
              autoComplete="address-line2"
            />
          </label>

          <div className="shop-location-sheet__row">
            <label className="shop-location-sheet__field shop-location-sheet__field--grow">
              <span className="shop-location-sheet__label">City</span>
              <input
                className="shop-location-sheet__input"
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(e) => update({ city: e.target.value })}
                autoComplete="address-level2"
              />
            </label>
            <label className="shop-location-sheet__field shop-location-sheet__field--state">
              <span className="shop-location-sheet__label">State</span>
              <input
                className="shop-location-sheet__input"
                type="text"
                placeholder="State"
                value={form.state}
                onChange={(e) => update({ state: e.target.value })}
                autoComplete="address-level1"
              />
            </label>
          </div>

          <label className="shop-location-sheet__field">
            <span className="shop-location-sheet__label">ZIP code</span>
            <input
              className="shop-location-sheet__input"
              type="text"
              placeholder="ZIP code"
              value={form.postalCode}
              onChange={(e) => update({ postalCode: e.target.value })}
              autoComplete="postal-code"
            />
          </label>

          {canSave ? (
            <p className="shop-location-sheet__preview">
              <span className="shop-location-sheet__preview-label">Preview</span>
              {formatShopLocationSummary(form)}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
