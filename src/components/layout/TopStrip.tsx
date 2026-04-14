import { useEffect, useRef, useState } from 'react';
import { highlights } from '../../data/highlights';

const ROTATION_MS = 9000;
const FADE_MS = 500;

export default function TopStrip() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [hidden, setHidden] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => setHidden(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const interval = setInterval(() => {
      if (pausedRef.current) return;
      setVisible(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % highlights.length);
        setVisible(true);
      }, FADE_MS);
    }, ROTATION_MS);

    return () => clearInterval(interval);
  }, []);

  const current = highlights[index];

  const body = (
    <span className="flex items-center gap-2 sm:gap-3 min-w-0">
      <span
        className="w-1 h-1 rounded-full bg-gold/60 animate-pulse flex-shrink-0"
        aria-hidden="true"
      />
      <span className="text-gold text-[10px] sm:text-[11px] font-semibold tracking-[0.15em] uppercase flex-shrink-0">
        {current.mark}
      </span>
      <span className="text-[#333] flex-shrink-0" aria-hidden="true">
        ·
      </span>
      <span className="text-[11px] sm:text-[12px] text-[#8a8a8a] tracking-wide truncate">
        {current.text}
      </span>
    </span>
  );

  return (
    <div
      role="region"
      aria-label="Aprikos Venture highlights"
      className={`fixed inset-x-0 top-0 z-40 h-9 flex items-center justify-center px-4 overflow-hidden transition-all duration-500 ease-out ${
        hidden ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div
        className={`w-full max-w-3xl flex justify-center transition-opacity duration-500 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {current.href ? (
          <a
            href={current.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity min-w-0 max-w-full"
          >
            {body}
          </a>
        ) : (
          <span className="min-w-0 max-w-full">{body}</span>
        )}
      </div>
    </div>
  );
}
