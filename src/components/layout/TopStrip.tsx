import { useEffect, useState } from 'react';
import { highlights } from '../../data/highlights';

export default function TopStrip() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => setHidden(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loop = [...highlights, ...highlights];

  return (
    <div
      role="region"
      aria-label="Aprikos Venture highlights"
      className={`group fixed inset-x-0 top-0 z-40 h-9 flex items-center overflow-hidden transition-all duration-500 ease-out hover:opacity-100 ${
        hidden ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-60 translate-y-0'
      }`}
    >
      <div className="flex whitespace-nowrap animate-ticker motion-reduce:animate-none group-hover:[animation-play-state:paused] will-change-transform">
        {loop.map((item, i) => {
          const body = (
            <span className="inline-flex items-center gap-3 px-6">
              <span
                className="w-1 h-1 rounded-full bg-gold/60 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="text-gold text-[11px] font-semibold tracking-[0.15em] uppercase">
                {item.mark}
              </span>
              <span className="text-[#333]" aria-hidden="true">
                ·
              </span>
              <span className="text-[12px] text-[#8a8a8a] tracking-wide">
                {item.text}
              </span>
            </span>
          );
          return (
            <span
              key={`${item.mark}-${i}`}
              className="inline-flex items-center"
            >
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  {body}
                </a>
              ) : (
                body
              )}
              <span
                className="text-[#2a2a2a] select-none"
                aria-hidden="true"
              >
                |
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
