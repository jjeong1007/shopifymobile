import { getProductCategoryLabel } from './productDraft';

export type CatalogProduct = {
  id: string;
  title: string;
  price: string;
  hasImages: boolean;
  description: string;
  categoryPath: string;
  status: 'active';
  createdAt: number;
};

const CATALOG_KEY = 'shopify-prototype-product-catalog';

export function getCatalogProducts(): CatalogProduct[] {
  const raw = sessionStorage.getItem(CATALOG_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CatalogProduct[];
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export function saveCatalogProduct(
  product: Omit<CatalogProduct, 'id' | 'status' | 'createdAt'>,
): CatalogProduct {
  const entry: CatalogProduct = {
    ...product,
    id: `product-${Date.now()}`,
    status: 'active',
    createdAt: Date.now(),
  };
  const catalog = getCatalogProducts();
  sessionStorage.setItem(CATALOG_KEY, JSON.stringify([entry, ...catalog]));
  return entry;
}

export function clearProductCatalog() {
  sessionStorage.removeItem(CATALOG_KEY);
}

export function formatCatalogPrice(price: string): string {
  const trimmed = price.trim();
  if (!trimmed) return '$0.00';
  if (trimmed.startsWith('$')) return trimmed;
  const value = Number.parseFloat(trimmed.replace(/[^0-9.]/g, ''));
  if (Number.isNaN(value)) return '$0.00';
  return `$${value.toFixed(2)}`;
}

export function getCatalogProductSubtitle(product: CatalogProduct): string {
  if (product.categoryPath) return getProductCategoryLabel(product.categoryPath);
  if (product.price) return formatCatalogPrice(product.price);
  return 'No category';
}
