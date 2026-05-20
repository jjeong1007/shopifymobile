import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import welcomeScreen from '../assets/welcome-screen@3x.png';
import './WelcomePage.css';

/** Figma Screen 25 — node 419:1645 (390×844) */
const FRAME_WIDTH = 390;
const FRAME_HEIGHT = 844;

// Artwork only — clip above buttons (742px content minus button area)
const CONTENT = { top: 77, left: 12, width: 366, height: 610 };

const GET_STARTED = { top: 698, left: 24, width: 342, height: 52 };
const LOG_IN = { top: 762, left: 24, width: 342, height: 52 };

type Rect = { top: number; left: number; width: number; height: number };

function toPx(rect: Rect, scale: number) {
  return {
    top: `${rect.top * scale}px`,
    left: `${rect.left * scale}px`,
    width: `${rect.width * scale}px`,
    height: `${rect.height * scale}px`,
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
      // Fit entire frame so buttons are never clipped
      setScale(Math.min(clientWidth / FRAME_WIDTH, clientHeight / FRAME_HEIGHT));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const frameStyle = {
    width: FRAME_WIDTH * scale,
    height: FRAME_HEIGHT * scale,
  };

  return (
    <div className="welcome" ref={containerRef}>
      <div className="welcome__frame" style={frameStyle}>
        <div className="welcome__content" style={toPx(CONTENT, scale)}>
          <img
            alt=""
            className="welcome__artwork"
            src={welcomeScreen}
            draggable={false}
          />
        </div>

        <button
          type="button"
          className={`welcome__btn welcome__btn--primary ${pressed === 'get-started' ? 'welcome__btn--pressed' : ''}`}
          style={toPx(GET_STARTED, scale)}
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
          style={toPx(LOG_IN, scale)}
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
