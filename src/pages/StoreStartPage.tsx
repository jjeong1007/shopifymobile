import { useNavigate } from 'react-router-dom';
import shopAppIcon from '../assets/shop-app-icon.png';
import './StoreStartPage.css';

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M7.5 5l5 5-5 5"
        stroke="#8C9196"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="7.25" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M10 6v4l2.5 2.5" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="7" r="3" stroke="#1A1A1A" strokeWidth="1.5" />
      <path
        d="M4.5 16.5c.9-2.5 2.8-3.75 5.5-3.75s4.6 1.25 5.5 3.75"
        stroke="#1A1A1A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5 6 4h12l2 6.5H4z"
        stroke="#1A1A1A"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M6 10.5V18h12v-7.5"
        stroke="#1A1A1A"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 18v-4h4v4" stroke="#1A1A1A" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

type StoreOption = 'shop' | 'storefront';

export function StoreStartPage() {
  const navigate = useNavigate();

  const selectOption = (option: StoreOption) => {
    sessionStorage.setItem('shopify-prototype-store-type', option);
    if (option === 'shop') {
      navigate('/shop/setup');
      return;
    }
    console.info('[prototype] Storefront flow not implemented');
  };

  return (
    <div className="store-start">
      <h1 className="store-start__title">How do you want to start your store?</h1>

      <button
        type="button"
        className="store-start__card store-start__card--shop"
        onClick={() => selectOption('shop')}
      >
        <div className="store-start__card-body">
          <span className="store-start__chip">Fastest Setup</span>

          <div className="store-start__card-header">
            <img alt="" className="store-start__shop-icon" src={shopAppIcon} />
            <span className="store-start__card-title">Sell on Shop</span>
          </div>

          <p className="store-start__card-desc">
            List your products inside the Shop app, where millions of shoppers already browse. No
            website needed.
          </p>

          <ul className="store-start__features">
            <li>
              <ClockIcon />
              <span>Ready in minutes</span>
            </li>
            <li>
              <PersonIcon />
              <span>Built-in audience</span>
            </li>
          </ul>
        </div>
        <ChevronRightIcon />
      </button>

      <button
        type="button"
        className="store-start__card store-start__card--storefront"
        onClick={() => selectOption('storefront')}
      >
        <div className="store-start__card-body">
          <div className="store-start__card-header">
            <StoreIcon />
            <span className="store-start__card-title">Build a Storefront</span>
          </div>

          <p className="store-start__card-desc">
            Create your own branded website with full customization, your own domain, and direct
            customer relationships
          </p>

          <ul className="store-start__features">
            <li>
              <ClockIcon />
              <span>Full design control</span>
            </li>
            <li>
              <PersonIcon />
              <span>Own your customer data</span>
            </li>
            <li>
              <PersonIcon />
              <span>Takes more setup time</span>
            </li>
          </ul>
        </div>
        <ChevronRightIcon />
      </button>

      <p className="store-start__footer">
        Not sure?{' '}
        <button type="button" className="store-start__footer-link">
          Compare in detail
        </button>
      </p>
    </div>
  );
}
