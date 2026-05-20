import { useEffect, useState } from 'react';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import { ChevronRightIcon, OrderIcon } from '@shopify/polaris-icons';
import { useNavigate } from 'react-router-dom';
import { PolarisIcon } from '../components/PolarisIcon';
import { ShopBottomNav } from '../components/ShopBottomNav';
import { formatOrderTotal, getShopOrders, type ShopOrder } from '../lib/shopOrders';
import '@shopify/polaris/build/esm/styles.css';
import './ShopOrdersPage.css';

type OrderFilter = 'all' | 'unfulfilled' | 'fulfilled';

const ORDER_FILTERS: { id: OrderFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unfulfilled', label: 'Unfulfilled' },
  { id: 'fulfilled', label: 'Fulfilled' },
];

function OrderListItem({ order }: { order: ShopOrder }) {
  return (
    <div className="shop-orders__item">
      <div className="shop-orders__item-copy">
        <div className="shop-orders__item-top">
          <p className="shop-orders__item-number">{order.number}</p>
          <span
            className={`shop-orders__item-badge shop-orders__item-badge--${order.fulfillmentStatus}`}
          >
            {order.fulfillmentStatus === 'fulfilled' ? 'Fulfilled' : 'Unfulfilled'}
          </span>
        </div>
        <p className="shop-orders__item-customer">{order.customerName}</p>
        <div className="shop-orders__item-footer">
          <span className="shop-orders__item-date">{order.dateLabel}</span>
          <span className="shop-orders__item-total">{formatOrderTotal(order.total)}</span>
        </div>
      </div>
      <PolarisIcon source={ChevronRightIcon} tone="subdued" className="shop-orders__icon--20" />
    </div>
  );
}

export function ShopOrdersPage() {
  const navigate = useNavigate();
  const [orders] = useState(() => getShopOrders());
  const [filter, setFilter] = useState<OrderFilter>('all');

  useEffect(() => {
    if (sessionStorage.getItem('shopify-prototype-store-type') !== 'shop') {
      navigate('/store-start', { replace: true });
    }
  }, [navigate]);

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.fulfillmentStatus === filter;
  });

  const orderCount = filteredOrders.length;
  const countLabel =
    filter === 'all'
      ? orderCount === 1
        ? '1 order'
        : `${orderCount} orders`
      : `${orderCount} ${filter}`;

  return (
    <AppProvider i18n={enTranslations}>
      <div className="shop-orders">
        <header className="shop-orders__header">
          <h1 className="shop-orders__title">Orders</h1>
          <p className="shop-orders__subtitle">{countLabel}</p>
        </header>

        <div className="shop-orders__filters" role="tablist" aria-label="Order filters">
          {ORDER_FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              className={`shop-orders__filter${filter === item.id ? ' shop-orders__filter--active' : ''}`}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="shop-orders__scroll">
          {filteredOrders.length > 0 ? (
            <section className="shop-orders__section">
              <div className="shop-orders__list">
                {filteredOrders.map((order) => (
                  <OrderListItem key={order.id} order={order} />
                ))}
              </div>
            </section>
          ) : (
            <section className="shop-orders__empty">
              <div className="shop-orders__empty-icon">
                <PolarisIcon source={OrderIcon} tone="subdued" className="shop-orders__icon--24" />
              </div>
              <h2 className="shop-orders__empty-title">No orders yet</h2>
              <p className="shop-orders__empty-desc">
                When customers buy from your Shop store, their orders will show up here so you can
                fulfill and track them.
              </p>
            </section>
          )}
        </div>

        <ShopBottomNav activeTab="orders" />
      </div>
    </AppProvider>
  );
}
