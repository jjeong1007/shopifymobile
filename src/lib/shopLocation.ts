export type ShopLocation = {
  country: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
};

const STORAGE_KEY = 'shopify-prototype-shop-location';

const DEFAULT_LOCATION: ShopLocation = {
  country: 'United States',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
};

export const SHOP_LOCATION_COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Mexico',
  'Germany',
  'France',
] as const;

export function getShopLocation(): ShopLocation {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return { ...DEFAULT_LOCATION };
  try {
    const parsed = JSON.parse(raw) as Partial<ShopLocation>;
    return { ...DEFAULT_LOCATION, ...parsed };
  } catch {
    return { ...DEFAULT_LOCATION };
  }
}

export function setShopLocation(location: ShopLocation) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(location));
}

export function clearShopLocation() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function formatShopLocationSummary(location: ShopLocation): string {
  const parts = [
    location.addressLine1,
    location.city,
    location.state,
    location.postalCode,
  ].filter(Boolean);
  if (parts.length > 0) return parts.join(', ');
  return location.country;
}

export function formatShopLocationSubtitle(location: ShopLocation): string {
  if (location.addressLine1.trim()) {
    const line2 = [location.city, location.state].filter(Boolean).join(', ');
    return line2 || location.country;
  }
  return location.country;
}
