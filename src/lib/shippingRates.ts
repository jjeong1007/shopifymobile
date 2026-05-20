export type ShippingRateId =
  | 'domestic-standard'
  | 'domestic-express'
  | 'international-standard';

export type ShippingRate = {
  id: string;
  name: string;
  deliveryTime: string;
  price: string;
  /** Order minimum for free shipping, e.g. "70". Null when not offered. */
  freeShippingMinimum: string | null;
};

const RATES_STORAGE_KEY = 'shopify-prototype-shipping-rates';
const CUSTOM_DOMESTIC_KEY = 'shopify-prototype-custom-domestic-rates';

const DEFAULT_RATES: Record<ShippingRateId, ShippingRate> = {
  'domestic-standard': {
    id: 'domestic-standard',
    name: 'Standard',
    deliveryTime: '3-5 business days',
    price: '8.00',
    freeShippingMinimum: '70',
  },
  'domestic-express': {
    id: 'domestic-express',
    name: 'Express',
    deliveryTime: '1-2 business days',
    price: '15.00',
    freeShippingMinimum: null,
  },
  'international-standard': {
    id: 'international-standard',
    name: 'Standard',
    deliveryTime: '7-14 business days',
    price: '24.00',
    freeShippingMinimum: '70',
  },
};

export const BUILT_IN_RATE_IDS = Object.keys(DEFAULT_RATES) as ShippingRateId[];

export function isBuiltInRateId(id: string): id is ShippingRateId {
  return BUILT_IN_RATE_IDS.includes(id as ShippingRateId);
}

export function isCustomDomesticRateId(id: string): boolean {
  return id.startsWith('domestic-custom-');
}

export function getDefaultShippingRates(): Record<ShippingRateId, ShippingRate> {
  return {
    'domestic-standard': { ...DEFAULT_RATES['domestic-standard'] },
    'domestic-express': { ...DEFAULT_RATES['domestic-express'] },
    'international-standard': { ...DEFAULT_RATES['international-standard'] },
  };
}

export function getShippingRates(): Record<ShippingRateId, ShippingRate> {
  const defaults = getDefaultShippingRates();
  const raw = sessionStorage.getItem(RATES_STORAGE_KEY);
  if (!raw) return defaults;
  try {
    const parsed = JSON.parse(raw) as Partial<Record<ShippingRateId, ShippingRate>>;
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

export function getCustomDomesticRates(): ShippingRate[] {
  const raw = sessionStorage.getItem(CUSTOM_DOMESTIC_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ShippingRate[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getDomesticShippingRates(): ShippingRate[] {
  const builtIn = getShippingRates();
  return [builtIn['domestic-standard'], builtIn['domestic-express'], ...getCustomDomesticRates()];
}

export function getRateById(id: string): ShippingRate | undefined {
  if (isBuiltInRateId(id)) return getShippingRates()[id];
  return getCustomDomesticRates().find((rate) => rate.id === id);
}

export function setShippingRates(rates: Record<ShippingRateId, ShippingRate>) {
  sessionStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(rates));
}

export function setCustomDomesticRates(rates: ShippingRate[]) {
  sessionStorage.setItem(CUSTOM_DOMESTIC_KEY, JSON.stringify(rates));
}

export function setShippingRate(rate: ShippingRate) {
  if (isCustomDomesticRateId(rate.id)) {
    const custom = getCustomDomesticRates();
    const index = custom.findIndex((r) => r.id === rate.id);
    if (index >= 0) {
      custom[index] = rate;
      setCustomDomesticRates(custom);
    }
    return;
  }
  if (isBuiltInRateId(rate.id)) {
    const rates = getShippingRates();
    rates[rate.id] = rate;
    setShippingRates(rates);
  }
}

export function canDeleteRate(id: string): boolean {
  return isCustomDomesticRateId(id);
}

export function deleteCustomDomesticRate(id: string): boolean {
  if (!isCustomDomesticRateId(id)) return false;
  const custom = getCustomDomesticRates().filter((rate) => rate.id !== id);
  setCustomDomesticRates(custom);
  return true;
}

export function addCustomDomesticRate(
  rate: Omit<ShippingRate, 'id'>,
): ShippingRate {
  const newRate: ShippingRate = {
    ...rate,
    id: `domestic-custom-${Date.now()}`,
  };
  const custom = getCustomDomesticRates();
  setCustomDomesticRates([...custom, newRate]);
  return newRate;
}

export function clearShippingRates() {
  sessionStorage.removeItem(RATES_STORAGE_KEY);
  sessionStorage.removeItem(CUSTOM_DOMESTIC_KEY);
}

export function formatRateDescription(rate: ShippingRate): string {
  if (rate.freeShippingMinimum?.trim()) {
    return `Free for orders $${rate.freeShippingMinimum.trim()} and up • ${rate.deliveryTime}`;
  }
  return rate.deliveryTime;
}

export function formatRatePrice(rate: ShippingRate): string {
  const value = Number.parseFloat(rate.price.replace(/[^0-9.]/g, ''));
  if (Number.isNaN(value)) return '$0.00';
  return `$${value.toFixed(2)}`;
}

export function getRateSheetTitle(rateId: string | null, mode: 'add' | 'edit'): string {
  if (mode === 'add') return 'Add shipping option';
  if (!rateId) return 'Edit shipping rate';
  switch (rateId) {
    case 'domestic-standard':
      return 'Edit Standard shipping';
    case 'domestic-express':
      return 'Edit Express shipping';
    case 'international-standard':
      return 'Edit International Standard';
    default:
      return 'Edit shipping option';
  }
}

export const EMPTY_RATE_FORM: Omit<ShippingRate, 'id'> = {
  name: '',
  deliveryTime: '',
  price: '',
  freeShippingMinimum: null,
};
