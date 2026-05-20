import { useEffect, useState } from 'react';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import { ChevronRightIcon, ProductIcon } from '@shopify/polaris-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import productMain from '../assets/placeholder-product-main.png';
import { PolarisIcon } from '../components/PolarisIcon';
import { ShopBottomNav } from '../components/ShopBottomNav';
import {
  formatCatalogPrice,
  getCatalogProductSubtitle,
  getCatalogProducts,
  type CatalogProduct,
} from '../lib/productCatalog';
import '@shopify/polaris/build/esm/styles.css';
import './ShopProductsPage.css';

function ProductListItem({ product }: { product: CatalogProduct }) {
  return (
    <div className="shop-products__item">
      <div className="shop-products__item-media">
        {product.hasImages ? (
          <img src={productMain} alt="" className="shop-products__item-img" />
        ) : (
          <span className="shop-products__item-placeholder" aria-hidden>
            <PolarisIcon source={ProductIcon} tone="subdued" className="shop-products__icon--20" />
          </span>
        )}
      </div>
      <div className="shop-products__item-copy">
        <p className="shop-products__item-title">{product.title}</p>
        <p className="shop-products__item-meta">{getCatalogProductSubtitle(product)}</p>
        <div className="shop-products__item-footer">
          <span className="shop-products__item-price">{formatCatalogPrice(product.price)}</span>
          <span className="shop-products__item-badge">Active</span>
        </div>
      </div>
      <PolarisIcon source={ChevronRightIcon} tone="subdued" className="shop-products__icon--20" />
    </div>
  );
}

export function ShopProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState(() => getCatalogProducts());

  useEffect(() => {
    if (sessionStorage.getItem('shopify-prototype-store-type') !== 'shop') {
      navigate('/store-start', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    setProducts(getCatalogProducts());
  }, [location.key]);

  const productCount = products.length;
  const countLabel = productCount === 1 ? '1 product' : `${productCount} products`;

  const openAddProduct = () => {
    navigate('/shop/product/add', { state: { returnTo: '/shop/products' } });
  };

  return (
    <AppProvider i18n={enTranslations}>
      <div className="shop-products">
        <header className="shop-products__header">
          <h1 className="shop-products__title">Products</h1>
          <p className="shop-products__subtitle">{countLabel}</p>
        </header>

        <div className="shop-products__scroll">
          {productCount > 0 ? (
            <section className="shop-products__section shop-products__section--list">
              <h2 className="shop-products__section-title">All products</h2>
              <div className="shop-products__list">
                {products.map((product) => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            </section>
          ) : (
            <section className="shop-products__empty">
              <div className="shop-products__empty-icon">
                <PolarisIcon source={ProductIcon} tone="subdued" className="shop-products__icon--24" />
              </div>
              <h2 className="shop-products__empty-title">No products yet</h2>
              <p className="shop-products__empty-desc">
                Add products to your catalog so customers can browse and buy in the Shop app.
              </p>
              <button type="button" className="shop-products__empty-btn" onClick={openAddProduct}>
                Add your first product
              </button>
            </section>
          )}
        </div>

        <ShopBottomNav activeTab="products" />
      </div>
    </AppProvider>
  );
}
