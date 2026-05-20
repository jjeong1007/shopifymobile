import { findCategoryByPath } from './shopifyProductCategories';

const DESCRIPTION_KEY = 'shopify-prototype-product-description';
const CATEGORY_KEY = 'shopify-prototype-product-category';

export function getProductDescription(): string {
  return sessionStorage.getItem(DESCRIPTION_KEY) ?? '';
}

export function setProductDescription(value: string) {
  sessionStorage.setItem(DESCRIPTION_KEY, value);
}

export function getProductCategory(): string {
  return sessionStorage.getItem(CATEGORY_KEY) ?? '';
}

export function setProductCategory(value: string) {
  sessionStorage.setItem(CATEGORY_KEY, value);
}

export function clearProductDraft() {
  sessionStorage.removeItem(DESCRIPTION_KEY);
  sessionStorage.removeItem(CATEGORY_KEY);
}

export function truncateText(text: string, max = 42): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trimEnd()}…`;
}

/** Display label for a saved taxonomy path (leaf name). */
export function getProductCategoryLabel(path: string): string {
  if (!path.trim()) return '';
  return findCategoryByPath(path)?.label ?? path.split(' > ').pop() ?? path;
}
