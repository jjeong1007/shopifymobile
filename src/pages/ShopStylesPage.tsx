import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingHeader } from '../components/OnboardingHeader';
import {
  isBannerUploaded,
  isLogoUploaded,
  setBannerUploaded,
  setLogoUploaded,
  setStoreTheme,
  type StoreThemeId,
} from '../lib/shopStore';
import './ShopStylesPage.css';

function ImageAddIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="3.5" y="3.5" width="13" height="13" rx="2" stroke="#303030" strokeWidth="1.5" />
      <path d="M10 7v6M7 10h6" stroke="#303030" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="8" fill="#008060" />
      <path
        d="M6.5 10.2l2.2 2.2 4.8-4.8"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const THEMES: { id: StoreThemeId; label: string; swatches: string[] }[] = [
  { id: 'minimal', label: 'Minimal', swatches: ['#f1e8df', '#ece5de', '#d4dace'] },
  { id: 'bold', label: 'Bold', swatches: ['#f68634', '#f79dc1', '#bba8e8'] },
  { id: 'elegant', label: 'Elegant', swatches: ['#f2ede5', '#dad1c8', '#b8beaf'] },
];

function UploadZone({
  title,
  hint,
  uploaded,
  onUpload,
}: {
  title: string;
  hint: string;
  uploaded: boolean;
  onUpload: () => void;
}) {
  return (
    <div className={`shop-styles__upload-zone${uploaded ? ' shop-styles__upload-zone--success' : ''}`}>
      {uploaded ? (
        <div className="shop-styles__upload-content">
          <CheckIcon />
          <p className="shop-styles__upload-success">Upload successful</p>
        </div>
      ) : (
        <div className="shop-styles__upload-content">
          <ImageAddIcon />
          <p className="shop-styles__upload-title">{title}</p>
          <p className="shop-styles__upload-hint">{hint}</p>
          <button type="button" className="shop-styles__upload-btn" onClick={onUpload}>
            Upload
          </button>
        </div>
      )}
    </div>
  );
}

export function ShopStylesPage() {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState<StoreThemeId>(() => {
    const saved = sessionStorage.getItem('shopify-prototype-store-theme');
    if (saved === 'bold' || saved === 'elegant') return saved;
    return 'minimal';
  });
  const [logoUploaded, setLogoUploadedState] = useState(isLogoUploaded);
  const [bannerUploaded, setBannerUploadedState] = useState(isBannerUploaded);

  const themesDisabled = bannerUploaded;

  const handleLogoUpload = () => {
    setLogoUploaded(true);
    setLogoUploadedState(true);
  };

  const handleBannerUpload = () => {
    setBannerUploaded(true);
    setBannerUploadedState(true);
  };

  useEffect(() => {
    if (sessionStorage.getItem('shopify-prototype-store-type') !== 'shop') {
      navigate('/store-start', { replace: true });
    }
  }, [navigate]);

  const finishStyling = () => {
    if (!themesDisabled) {
      setStoreTheme(selectedTheme);
    }
    navigate('/shop/home');
  };

  const handleSkip = () => {
    finishStyling();
  };

  const handleNext = () => {
    finishStyling();
  };

  return (
    <div className="shop-styles">
      <OnboardingHeader
        step={3}
        showBack
        onBack={() => navigate('/shop/setup')}
        showSkip
        onSkip={handleSkip}
      />

      <div className="shop-styles__scroll">
        <h1 className="shop-styles__title">Let&apos;s build your store</h1>
        <p className="shop-styles__subtitle">
          Add your business details, upload your logo, and choose a style for your Shop store.
        </p>

        <h2 className="shop-styles__section-title">Store Styles</h2>

        <section className="shop-styles__block">
          <h3 className="shop-styles__label">Store Logo</h3>
          <p className="shop-styles__hint">Upload your logo to display on your Shop store.</p>
          <UploadZone
            title="Upload your logo"
            hint="PNG, JPG, or SVG (recommended size: 512 x 512px)"
            uploaded={logoUploaded}
            onUpload={handleLogoUpload}
          />
        </section>

        <section className="shop-styles__block">
          <h3 className="shop-styles__label">Store Banner</h3>
          <p className="shop-styles__hint">Upload your banner to display on your Shop store.</p>
          <UploadZone
            title="Upload your banner"
            hint="PNG, JPG, or SVG (recommended size: 240 x 390px)"
            uploaded={bannerUploaded}
            onUpload={handleBannerUpload}
          />
        </section>

        <div className={`shop-styles__divider${themesDisabled ? ' shop-styles__divider--disabled' : ''}`}>
          <span className="shop-styles__divider-line" />
          <span className="shop-styles__divider-text">or</span>
          <span className="shop-styles__divider-line" />
        </div>

        <section
          className={`shop-styles__block shop-styles__theme-section${themesDisabled ? ' shop-styles__theme-section--disabled' : ''}`}
          aria-disabled={themesDisabled}
        >
          <h3 className="shop-styles__label">Store Banner Theme</h3>
          <p className="shop-styles__hint">If you don&apos;t have a banner, choose a theme instead</p>
          <div className="shop-styles__themes" role="radiogroup" aria-label="Store banner theme">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                role="radio"
                aria-checked={selectedTheme === theme.id}
                disabled={themesDisabled}
                className={`shop-styles__theme-card${selectedTheme === theme.id && !themesDisabled ? ' shop-styles__theme-card--selected' : ''}`}
                onClick={() => setSelectedTheme(theme.id)}
              >
                <span className="shop-styles__theme-name">{theme.label}</span>
                <span className="shop-styles__swatches">
                  {theme.swatches.map((color) => (
                    <span
                      key={color}
                      className="shop-styles__swatch"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
              </button>
            ))}
          </div>
        </section>

        <button
          type="button"
          className="shop-styles__customize"
          onClick={() => console.info('[prototype] Customize')}
        >
          Customize
        </button>
      </div>

      <footer className="shop-styles__footer">
        <button type="button" className="shop-styles__next" onClick={handleNext}>
          Next
        </button>
      </footer>
    </div>
  );
}
