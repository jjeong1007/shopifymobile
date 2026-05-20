import { FormEvent, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './EmailPage.css';

type Flow = 'signup' | 'login';

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
      <path
        d="M19.6 10.23c0-.68-.06-1.35-.17-2H10v3.78h5.4a4.56 4.56 0 0 1-1.97 2.99v2.48h3.18c1.87-1.72 2.95-4.26 2.95-7.25z"
        fill="#4285F4"
      />
      <path
        d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.18-2.48c-.89.6-2.04.95-3.44.95-2.64 0-4.88-1.78-5.68-4.18H1.13v2.56A10 10 0 0 0 10 20z"
        fill="#34A853"
      />
      <path
        d="M4.32 11.87A5.99 5.99 0 0 1 3.68 10c0-.65.11-1.28.32-1.87V5.57H1.13A10 10 0 0 0 0 10c0 1.61.39 3.14 1.13 4.43l3.19-2.56z"
        fill="#FBBC05"
      />
      <path
        d="M10 3.98c1.47 0 2.78.5 3.81 1.49l2.85-2.85C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.13 5.57l3.19 2.56C5.12 5.76 7.36 3.98 10 3.98z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 384 512" aria-hidden>
      <path
        fill="#000000"
        d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7-63.9 0-114.9 36.6-142.9 36.6-27.9 0-72-34.1-117.4-34.1-60.5 0-115.8 35.4-115.8 102.4 0 39.3 14.4 81.2c12.8 36.7 59 126.9 107.2 125.2 25-.5 43-16.9 76-16.9 32.9 0 48.7 16.9 76.1 16.9 48.8 0 90.5-84.1 103-125.3-65.2-30-61.7-90.9-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.2 2 49.9-16.4 69.5-34.3z"
      />
    </svg>
  );
}

function DesktopSiteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="13" rx="2" stroke="#007AFF" strokeWidth="1.75" />
      <path d="M8 20h8" stroke="#007AFF" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M12 17v3" stroke="#007AFF" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 12a8 8 0 1 1-2.34-5.66"
        stroke="#007AFF"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M20 4v6h-6"
        stroke="#007AFF"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
      <circle cx="10" cy="10" r="10" fill="#1877F2" />
      <path
        d="M11.1 17.5v-5.9h2l.3-2.9h-2.3V7.5c0-.8.2-1.4 1.4-1.4h1.2V3.6c-.2 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7v2.1H6.5v2.9h1.9v5.9h2.7z"
        fill="#fff"
      />
    </svg>
  );
}

export function EmailPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const flow = (searchParams.get('flow') === 'login' ? 'login' : 'signup') as Flow;

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const emailValid = useMemo(() => isValidEmail(email), [email]);
  const showError = submitted && !emailValid;

  const toggleFlow = () => {
    setSearchParams({ flow: flow === 'signup' ? 'login' : 'signup' });
  };

  const handleEmailSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (!emailValid) return;

    sessionStorage.setItem('shopify-prototype-email', email.trim());
    // Next screen will plug in here
    console.info('[prototype] Continue with email:', email.trim(), { flow });
  };

  const handleSocial = async (provider: string) => {
    setSocialLoading(provider);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSocialLoading(null);
    console.info('[prototype] Continue with', provider, { flow });
  };

  const handleRefresh = () => {
    setEmail('');
    setSubmitted(false);
  };

  return (
    <div className="email-page">
      <div className="email-page__backdrop" aria-hidden />

      <div className="email-page__sheet">
        <div className="email-page__browser-bar">
          <button type="button" className="email-page__cancel" onClick={() => navigate('/')}>
            Cancel
          </button>
          <div className="email-page__url-bar">accounts.shopify.com</div>
          <div className="email-page__browser-actions">
            <button
              type="button"
              className="email-page__browser-btn"
              aria-label="Request desktop site"
            >
              <DesktopSiteIcon />
            </button>
            <button
              type="button"
              className="email-page__browser-btn"
              aria-label="Refresh page"
              onClick={handleRefresh}
            >
              <RefreshIcon />
            </button>
          </div>
        </div>

        <form className="email-page__form" onSubmit={handleEmailSubmit} noValidate>
          <label className="email-page__field">
            <span className="visually-hidden">Email address</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (submitted) setSubmitted(false);
              }}
              className={`email-page__input ${showError ? 'email-page__input--error' : ''}`}
              aria-invalid={showError}
              aria-describedby={showError ? 'email-error' : undefined}
            />
          </label>
          {showError && (
            <p id="email-error" className="email-page__error" role="alert">
              Enter a valid email address
            </p>
          )}

          <button
            type="submit"
            className="email-page__continue"
            disabled={!email.trim()}
          >
            Continue with email
          </button>
        </form>

        <div className="email-page__divider">
          <span>or</span>
        </div>

        <div className="email-page__social">
          <button
            type="button"
            className="email-page__social-btn"
            disabled={!!socialLoading}
            onClick={() => handleSocial('google')}
          >
            <GoogleIcon />
            <span>{socialLoading === 'google' ? 'Connecting…' : 'Continue with Google'}</span>
          </button>
          <button
            type="button"
            className="email-page__social-btn"
            disabled={!!socialLoading}
            onClick={() => handleSocial('apple')}
          >
            <AppleIcon />
            <span>{socialLoading === 'apple' ? 'Connecting…' : 'Continue with Apple'}</span>
          </button>
          <button
            type="button"
            className="email-page__social-btn"
            disabled={!!socialLoading}
            onClick={() => handleSocial('facebook')}
          >
            <FacebookIcon />
            <span>{socialLoading === 'facebook' ? 'Connecting…' : 'Continue with Facebook'}</span>
          </button>
        </div>

        <p className="email-page__footer">
          {flow === 'signup' ? (
            <>
              Already have a Shopify account?{' '}
              <button type="button" className="email-page__footer-link" onClick={toggleFlow}>
                Log in
              </button>
            </>
          ) : (
            <>
              New to Shopify?{' '}
              <button type="button" className="email-page__footer-link" onClick={toggleFlow}>
                Get started
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
