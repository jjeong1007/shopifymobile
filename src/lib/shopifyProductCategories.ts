import {
  SHOPIFY_PRODUCT_CATEGORIES,
  SHOPIFY_TOP_LEVEL_CATEGORIES,
  type ShopifyProductCategory,
} from '../data/shopifyProductCategories';

export type { ShopifyProductCategory };

export { SHOPIFY_TOP_LEVEL_CATEGORIES };

export function getChildCategories(parentPath: string): ShopifyProductCategory[] {
  return SHOPIFY_PRODUCT_CATEGORIES.filter((c) => c.parentPath === parentPath);
}

export function categoryHasChildren(category: ShopifyProductCategory): boolean {
  return SHOPIFY_PRODUCT_CATEGORIES.some((c) => c.parentPath === category.path);
}

export function searchCategories(query: string, limit = 80): ShopifyProductCategory[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return SHOPIFY_PRODUCT_CATEGORIES.filter((c) => c.path.toLowerCase().includes(q)).slice(0, limit);
}

export function findCategoryByPath(path: string): ShopifyProductCategory | undefined {
  return SHOPIFY_PRODUCT_CATEGORIES.find((c) => c.path === path);
}

export function formatCategoryBreadcrumb(path: string): string {
  const category = findCategoryByPath(path);
  if (!category || !category.parentPath) return '';
  return category.parentPath;
}
