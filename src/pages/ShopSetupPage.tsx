import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingHeader } from '../components/OnboardingHeader';
import './ShopSetupPage.css';

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function ShopSetupPage() {
  const navigate = useNavigate();
  const savedEmail = sessionStorage.getItem('shopify-prototype-email') ?? '';

  useEffect(() => {
    if (sessionStorage.getItem('shopify-prototype-store-type') !== 'shop') {
      navigate('/store-start', { replace: true });
    }
  }, [navigate]);

  const [businessName, setBusinessName] = useState(
    () => sessionStorage.getItem('shopify-prototype-business-name') ?? '',
  );
  const [businessEmail, setBusinessEmail] = useState(
    () => sessionStorage.getItem('shopify-prototype-business-email') || savedEmail,
  );
  const [submitted, setSubmitted] = useState(false);

  const isValid = useMemo(
    () => businessName.trim().length > 0 && isValidEmail(businessEmail),
    [businessName, businessEmail],
  );

  const persistDetails = () => {
    if (businessName.trim()) {
      sessionStorage.setItem('shopify-prototype-business-name', businessName.trim());
    }
    if (businessEmail.trim()) {
      sessionStorage.setItem('shopify-prototype-business-email', businessEmail.trim());
    }
  };

  const goToStyles = () => {
    navigate('/shop/styles');
  };

  const handleSkip = () => {
    persistDetails();
    goToStyles();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    persistDetails();
    goToStyles();
  };

  return (
    <div className="shop-setup">
      <OnboardingHeader
        step={2}
        showBack
        onBack={() => navigate('/store-start')}
        showSkip
        onSkip={handleSkip}
      />

      <div className="shop-setup__content">
      <h1 className="shop-setup__title">Let&apos;s build your store</h1>
      <p className="shop-setup__subtitle">
        Add your business details, upload your logo, and choose a style for your Shop store.
      </p>

      <h2 className="shop-setup__section-title">Business details</h2>

      <form className="shop-setup__form" onSubmit={handleSubmit} noValidate>
        <label className="shop-setup__field">
          <span className="shop-setup__label">Business Name</span>
          <input
            type="text"
            name="businessName"
            placeholder="Name"
            value={businessName}
            onChange={(e) => {
              setBusinessName(e.target.value);
              if (submitted) setSubmitted(false);
            }}
            className={`shop-setup__input${submitted && !businessName.trim() ? ' shop-setup__input--error' : ''}`}
            aria-invalid={submitted && !businessName.trim()}
          />
        </label>

        <label className="shop-setup__field">
          <span className="shop-setup__label">Business Email</span>
          <input
            type="email"
            name="businessEmail"
            autoComplete="email"
            placeholder="Email"
            value={businessEmail}
            onChange={(e) => {
              setBusinessEmail(e.target.value);
              if (submitted) setSubmitted(false);
            }}
            className={`shop-setup__input${submitted && !isValidEmail(businessEmail) ? ' shop-setup__input--error' : ''}`}
            aria-invalid={submitted && !isValidEmail(businessEmail)}
          />
        </label>

        <button type="submit" className="shop-setup__next" disabled={!isValid}>
          Next
        </button>
      </form>
      </div>
    </div>
  );
}
