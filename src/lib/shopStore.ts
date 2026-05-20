import storeBannerPlaceholder from '../assets/placeholder-store-banner.png';
import storeLogoPlaceholder from '../assets/placeholder-store-logo.png';
import { clearShopLocation } from './shopLocation';
import { clearShippingRates } from './shippingRates';

export type StoreThemeId = 'minimal' | 'bold' | 'elegant';

/** Prototype placeholders shown on dashboard after mock upload */
export const STORE_LOGO_PLACEHOLDER = storeLogoPlaceholder;
export const STORE_BANNER_PLACEHOLDER = storeBannerPlaceholder;

export const THEME_BANNER_COLORS: Record<StoreThemeId, string> = {
  minimal: '#d9f7d8',
  bold: '#fde8d8',
  elegant: '#f2ede5',
};

/** Store logo avatar (top left) — primary accent from each theme */
export const THEME_STORE_LOGO_COLORS: Record<StoreThemeId, string> = {
  minimal: '#30c558',
  bold: '#f68634',
  elegant: '#b8beaf',
};

export const THEME_STORE_LOGO_TEXT_COLORS: Record<StoreThemeId, string> = {
  minimal: '#ffffff',
  bold: '#ffffff',
  elegant: '#303030',
};

export function getStoreTheme(): StoreThemeId {
  const theme = sessionStorage.getItem('shopify-prototype-store-theme');
  if (theme === 'bold' || theme === 'elegant') return theme;
  return 'minimal';
}

export function isLogoUploaded(): boolean {
  return sessionStorage.getItem('shopify-prototype-logo-uploaded') === 'true';
}

export function isBannerUploaded(): boolean {
  return sessionStorage.getItem('shopify-prototype-banner-uploaded') === 'true';
}

export function setLogoUploaded(value: boolean) {
  sessionStorage.setItem('shopify-prototype-logo-uploaded', value ? 'true' : 'false');
}

export function setBannerUploaded(value: boolean) {
  sessionStorage.setItem('shopify-prototype-banner-uploaded', value ? 'true' : 'false');
}

export function setStoreTheme(theme: StoreThemeId) {
  sessionStorage.setItem('shopify-prototype-store-theme', theme);
}

const SHIPPING_CONFIRMED_KEY = 'shopify-prototype-shipping-confirmed';

export function isShippingConfirmed(): boolean {
  return sessionStorage.getItem(SHIPPING_CONFIRMED_KEY) === 'true';
}

export function setShippingConfirmed(value: boolean) {
  sessionStorage.setItem(SHIPPING_CONFIRMED_KEY, value ? 'true' : 'false');
}

/** Store setup quick actions: style is complete after onboarding; shipping after save */
export const STORE_SETUP_TASK_COUNT = 4;

export function getStoreSetupProgressPercent(): number {
  let completed = 1;
  if (isShippingConfirmed()) completed += 1;
  return Math.round((completed / STORE_SETUP_TASK_COUNT) * 100);
}

export function clearStoreMedia() {
  setLogoUploaded(false);
  setBannerUploaded(false);
  setShippingConfirmed(false);
  clearShopLocation();
  clearShippingRates();
}

/** True when user skipped uploads and uses default theme styling */
export function usesDefaultThemeBanner(): boolean {
  return !isBannerUploaded();
}

export function getBusinessName(): string {
  return sessionStorage.getItem('shopify-prototype-business-name')?.trim() || 'Silver Makers';
}

export function getDisplayName(): string {
  const email = sessionStorage.getItem('shopify-prototype-business-email')
    || sessionStorage.getItem('shopify-prototype-email')
    || '';
  const local = email.split('@')[0] || 'Jason';
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export function getInitials(name: string, max = 2): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'SM';
  if (parts.length === 1) return parts[0].slice(0, max).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

