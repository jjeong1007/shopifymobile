import { useEffect, useState } from 'react';
import {
  addCustomDomesticRate,
  canDeleteRate,
  deleteCustomDomesticRate,
  EMPTY_RATE_FORM,
  formatRateDescription,
  formatRatePrice,
  getRateById,
  getRateSheetTitle,
  setShippingRate,
  type ShippingRate,
} from '../lib/shippingRates';
import './ShopShippingRateSheet.css';

type ShopShippingRateSheetProps = {
  open: boolean;
  mode: 'add' | 'edit';
  rateId: string | null;
  onClose: () => void;
  onSave: (rate: ShippingRate) => void;
  onDelete?: () => void;
};

export function ShopShippingRateSheet({
  open,
  mode,
  rateId,
  onClose,
  onSave,
  onDelete,
}: ShopShippingRateSheetProps) {
  const [visible, setVisible] = useState(open);
  const [form, setForm] = useState<ShippingRate | null>(null);
  const [freeShippingEnabled, setFreeShippingEnabled] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      if (mode === 'add') {
        setForm({ id: '', ...EMPTY_RATE_FORM });
        setFreeShippingEnabled(false);
        return;
      }
      if (rateId) {
        const rate = getRateById(rateId);
        if (rate) {
          setForm({ ...rate });
          setFreeShippingEnabled(Boolean(rate.freeShippingMinimum?.trim()));
        }
      }
    }
  }, [open, mode, rateId]);

  useEffect(() => {
    if (!open && visible) {
      const timer = window.setTimeout(() => setVisible(false), 280);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [open, visible]);

  if (!visible || !form) return null;

  const update = (patch: Partial<ShippingRate>) => {
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const handleSubmit = () => {
    const payload: Omit<ShippingRate, 'id'> = {
      name: form.name.trim(),
      deliveryTime: form.deliveryTime.trim(),
      price: form.price.trim(),
      freeShippingMinimum: freeShippingEnabled ? form.freeShippingMinimum?.trim() || null : null,
    };

    const saved =
      mode === 'add'
        ? addCustomDomesticRate(payload)
        : { ...payload, id: form.id };

    if (mode === 'edit') {
      setShippingRate(saved);
    }

    onSave(saved);
    onClose();
  };

  const canSave =
    form.name.trim().length > 0 &&
    form.deliveryTime.trim().length > 0 &&
    form.price.trim().length > 0 &&
    (!freeShippingEnabled || Boolean(form.freeShippingMinimum?.trim()));

  const showDelete = mode === 'edit' && Boolean(rateId && canDeleteRate(rateId));

  const handleDelete = () => {
    if (!form.id || !canDeleteRate(form.id)) return;
    deleteCustomDomesticRate(form.id);
    onDelete?.();
    onClose();
  };

  const previewRate: ShippingRate = {
    ...form,
    name: form.name.trim() || 'New rate',
    deliveryTime: form.deliveryTime.trim() || 'Delivery time',
    price: form.price.trim() || '0.00',
    freeShippingMinimum: freeShippingEnabled ? form.freeShippingMinimum : null,
  };

  return (
    <div
      className={`shop-rate-sheet${open ? ' shop-rate-sheet--open' : ''}`}
      role="presentation"
    >
      <button
        type="button"
        className="shop-rate-sheet__backdrop"
        aria-label="Close shipping rate editor"
        onClick={onClose}
      />
      <div
        className="shop-rate-sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shop-rate-sheet-title"
      >
        <div className="shop-rate-sheet__handle" aria-hidden />

        <header className="shop-rate-sheet__header">
          <button type="button" className="shop-rate-sheet__header-btn" onClick={onClose}>
            Cancel
          </button>
          <h2 id="shop-rate-sheet-title" className="shop-rate-sheet__title">
            {getRateSheetTitle(rateId, mode)}
          </h2>
          <button
            type="button"
            className="shop-rate-sheet__header-btn shop-rate-sheet__header-btn--done"
            onClick={handleSubmit}
            disabled={!canSave}
          >
            {mode === 'add' ? 'Add' : 'Done'}
          </button>
        </header>

        <div className="shop-rate-sheet__body">
          {mode === 'add' ? (
            <div className="shop-rate-sheet__zone-pill">
              <span className="shop-rate-sheet__zone-pill-label">Zone</span>
              <span className="shop-rate-sheet__zone-pill-value">Domestic</span>
            </div>
          ) : null}

          <p className="shop-rate-sheet__desc">
            {mode === 'add'
              ? 'Create a new rate for orders shipped within your country.'
              : 'Set the name, price, and delivery time customers see at checkout.'}
          </p>

          <label className="shop-rate-sheet__field">
            <span className="shop-rate-sheet__label">Rate name</span>
            <input
              className="shop-rate-sheet__input"
              type="text"
              placeholder="e.g. Economy, Overnight"
              value={form.name}
              onChange={(e) => update({ name: e.target.value })}
            />
          </label>

          <label className="shop-rate-sheet__field">
            <span className="shop-rate-sheet__label">Delivery time</span>
            <input
              className="shop-rate-sheet__input"
              type="text"
              placeholder="e.g. 3-5 business days"
              value={form.deliveryTime}
              onChange={(e) => update({ deliveryTime: e.target.value })}
            />
          </label>

          <label className="shop-rate-sheet__field">
            <span className="shop-rate-sheet__label">Price</span>
            <span className="shop-rate-sheet__price-wrap">
              <span className="shop-rate-sheet__price-prefix">$</span>
              <input
                className="shop-rate-sheet__input shop-rate-sheet__input--price"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => update({ price: e.target.value.replace(/[^0-9.]/g, '') })}
              />
            </span>
          </label>

          <div className="shop-rate-sheet__toggle-row">
            <label className="shop-rate-sheet__toggle">
              <input
                type="checkbox"
                checked={freeShippingEnabled}
                onChange={(e) => {
                  setFreeShippingEnabled(e.target.checked);
                  if (!e.target.checked) update({ freeShippingMinimum: null });
                  else if (!form.freeShippingMinimum) update({ freeShippingMinimum: '70' });
                }}
              />
              <span className="shop-rate-sheet__toggle-ui" aria-hidden />
              <span className="shop-rate-sheet__toggle-label">Offer free shipping on large orders</span>
            </label>
          </div>

          {freeShippingEnabled ? (
            <label className="shop-rate-sheet__field">
              <span className="shop-rate-sheet__label">Free shipping minimum order</span>
              <span className="shop-rate-sheet__price-wrap">
                <span className="shop-rate-sheet__price-prefix">$</span>
                <input
                  className="shop-rate-sheet__input shop-rate-sheet__input--price"
                  type="text"
                  inputMode="decimal"
                  placeholder="70"
                  value={form.freeShippingMinimum ?? ''}
                  onChange={(e) =>
                    update({ freeShippingMinimum: e.target.value.replace(/[^0-9.]/g, '') })
                  }
                />
              </span>
            </label>
          ) : null}

          {canSave ? (
            <div className="shop-rate-sheet__preview">
              <span className="shop-rate-sheet__preview-label">Preview</span>
              <p className="shop-rate-sheet__preview-name">{previewRate.name}</p>
              <p className="shop-rate-sheet__preview-desc">{formatRateDescription(previewRate)}</p>
              <span className="shop-rate-sheet__preview-badge">{formatRatePrice(previewRate)}</span>
            </div>
          ) : null}

          {showDelete ? (
            <div className="shop-rate-sheet__delete-wrap">
              <button type="button" className="shop-rate-sheet__delete" onClick={handleDelete}>
                Delete shipping option
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
