import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroIllustration from '../assets/hero-illustration.png';
import './WelcomePage.css';

const DESIGN_WIDTH = 390;
const DESIGN_HEIGHT = 844;

const CONTENT = { top: 25, left: 12, width: 366, height: 794 };
const GET_STARTED = { top: 698, left: 24, width: 342, height: 52 };
const LOG_IN = { top: 762, left: 24, width: 342, height: 52 };

function rectStyle(rect: typeof GET_STARTED) {
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

export function WelcomePage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pressed, setPressed] = useState<'get-started' | 'log-in' | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const { clientWidth, clientHeight } = container;
      const nextScale = Math.min(clientWidth / DESIGN_WIDTH, clientHeight / DESIGN_HEIGHT, 1);
      setScale(nextScale);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="welcome" ref={containerRef}>
      <div
        className="welcome__stage"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        <img
          alt=""
          className="welcome__artwork"
          src={heroIllustration}
          style={rectStyle(CONTENT)}
        />

        <button
          type="button"
          aria-label="Get started"
          className={`welcome__hit ${pressed === 'get-started' ? 'welcome__hit--pressed' : ''}`}
          style={rectStyle(GET_STARTED)}
          onClick={() => navigate('/email?flow=signup')}
          onPointerDown={() => setPressed('get-started')}
          onPointerUp={() => setPressed(null)}
          onPointerLeave={() => setPressed(null)}
        />
        <button
          type="button"
          aria-label="Log in"
          className={`welcome__hit ${pressed === 'log-in' ? 'welcome__hit--pressed' : ''}`}
          style={rectStyle(LOG_IN)}
          onClick={() => navigate('/email?flow=login')}
          onPointerDown={() => setPressed('log-in')}
          onPointerUp={() => setPressed(null)}
          onPointerLeave={() => setPressed(null)}
        />
      </div>
    </div>
  );
}
