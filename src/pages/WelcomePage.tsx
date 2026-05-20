import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import illustrationHero from '../assets/illustration-hero.png';
import { ShopifyLogo } from '../components/ShopifyLogo';
import './WelcomePage.css';

const FEATURES = [
  'Create your online store',
  'Grow your audience',
  'Accept in person payments',
] as const;

export function WelcomePage() {
  const navigate = useNavigate();
  const [pressed, setPressed] = useState<'get-started' | 'log-in' | null>(null);

  return (
    <div className="welcome">
      <header className="welcome__header">
        <ShopifyLogo size={36} />
      </header>

      <div className="welcome__illustration" aria-hidden>
        <div className="welcome__illustration-circle">
          <img
            alt=""
            className="welcome__illustration-img"
            src={illustrationHero}
          />
        </div>
      </div>

      <section className="welcome__copy">
        <h1 className="welcome__headline">Start selling online with Shopify</h1>
        <p className="welcome__subheadline">
          The commerce platform trusted by millions of businesses worldwide
        </p>
        <ul className="welcome__features">
          {FEATURES.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>

      <div className="welcome__actions">
        <button
          type="button"
          className={`welcome__btn welcome__btn--primary ${pressed === 'get-started' ? 'welcome__btn--pressed' : ''}`}
          onClick={() => navigate('/email?flow=signup')}
          onPointerDown={() => setPressed('get-started')}
          onPointerUp={() => setPressed(null)}
          onPointerLeave={() => setPressed(null)}
        >
          Get started
        </button>
        <button
          type="button"
          className={`welcome__btn welcome__btn--secondary ${pressed === 'log-in' ? 'welcome__btn--pressed' : ''}`}
          onClick={() => navigate('/email?flow=login')}
          onPointerDown={() => setPressed('log-in')}
          onPointerUp={() => setPressed(null)}
          onPointerLeave={() => setPressed(null)}
        >
          Log in
        </button>
      </div>
    </div>
  );
}
