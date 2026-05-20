export type OrderFulfillmentStatus = 'unfulfilled' | 'fulfilled';

export type ShopOrder = {
  id: string;
  number: string;
  customerName: string;
  dateLabel: string;
  total: string;
  fulfillmentStatus: OrderFulfillmentStatus;
};

const ORDERS_KEY = 'shopify-prototype-shop-orders';

/** Prototype: no orders until checkout flow exists */
export function getShopOrders(): ShopOrder[] {
  const raw = sessionStorage.getItem(ORDERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ShopOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearShopOrders() {
  sessionStorage.removeItem(ORDERS_KEY);
}

export function formatOrderTotal(total: string): string {
  const trimmed = total.trim();
  if (!trimmed) return '$0.00';
  if (trimmed.startsWith('$')) return trimmed;
  const value = Number.parseFloat(trimmed.replace(/[^0-9.]/g, ''));
  if (Number.isNaN(value)) return '$0.00';
  return `$${value.toFixed(2)}`;
}
