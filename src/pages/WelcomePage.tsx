import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import welcomeFigma from '../assets/welcome-figma.png';
import './WelcomePage.css';

/** Figma node 419:1647 — IMG_2092 1 (366×742) */
const DESIGN_WIDTH = 366;
const DESIGN_HEIGHT = 742;

// Button positions from Screen 25, mapped into the 742px-tall artwork
const GET_STARTED = { top: 629, left: 12, width: 342, height: 52 };
const LOG_IN = { top: 689, left: 12, width: 342, height: 52 };

type Rect = typeof GET_STARTED;

function scaleRect(rect: Rect, scale: number) {
  return {
    top: rect.top * scale,
    left: rect.left * scale,
    width: rect.width * scale,
    height: rect.height * scale,
  };
}

export function WelcomePage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ scale: 1, offsetX: 0, offsetY: 0 });
  const [pressed, setPressed] = useState<'get-started' | 'log-in' | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateLayout = () => {
      const { clientWidth, clientHeight } = container;
      // Fill width on mobile so the design reads at full size
      const scale = clientWidth / DESIGN_WIDTH;
      const scaledHeight = DESIGN_HEIGHT * scale;
      const offsetX = 0;
      const offsetY = Math.max(0, (clientHeight - scaledHeight) / 2);

      setLayout({ scale, offsetX, offsetY });
    };

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const getStartedStyle = scaleRect(GET_STARTED, layout.scale);
  const logInStyle = scaleRect(LOG_IN, layout.scale);

  return (
    <div className="welcome" ref={containerRef}>
      <div
        className="welcome__stage"
        style={{
          width: DESIGN_WIDTH * layout.scale,
          height: DESIGN_HEIGHT * layout.scale,
          left: layout.offsetX,
          top: layout.offsetY,
        }}
      >
        <img
          alt=""
          className="welcome__artwork"
          src={welcomeFigma}
          width={DESIGN_WIDTH}
          height={DESIGN_HEIGHT}
          draggable={false}
        />

        <button
          type="button"
          aria-label="Get started"
          className={`welcome__hit ${pressed === 'get-started' ? 'welcome__hit--pressed' : ''}`}
          style={getStartedStyle}
          onClick={() => navigate('/email?flow=signup')}
          onPointerDown={() => setPressed('get-started')}
          onPointerUp={() => setPressed(null)}
          onPointerLeave={() => setPressed(null)}
        />
        <button
          type="button"
          aria-label="Log in"
          className={`welcome__hit ${pressed === 'log-in' ? 'welcome__hit--pressed' : ''}`}
          style={logInStyle}
          onClick={() => navigate('/email?flow=login')}
          onPointerDown={() => setPressed('log-in')}
          onPointerUp={() => setPressed(null)}
          onPointerLeave={() => setPressed(null)}
        />
      </div>
    </div>
  );
}
