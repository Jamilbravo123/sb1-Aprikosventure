import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../lib/gsap';
import HeroHeading from './HeroHeading';

export default function HeroContent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.from(containerRef.current.querySelectorAll('.hero-fade'), {
      y: 15,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out',
      delay: 0.8,
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 text-center">
      <div className="hero-fade flex flex-col items-center gap-1.5 mb-6">
        <span className="text-gold text-[10px] sm:text-[11px] tracking-[4px] sm:tracking-[5px] uppercase">
          Venture Studio
        </span>
        <span className="text-[#555] text-[9px] sm:text-[10px] tracking-[3px] sm:tracking-[4px] uppercase">
          Oslo | Berlin | Lahore | Dubai
        </span>
      </div>

      <HeroHeading />

      <p className="hero-fade text-[#777] text-base leading-relaxed max-w-[520px] mt-5">
        We build and scale ventures across AI, digital assets, and emerging markets.
      </p>

      <div className="hero-fade flex flex-col sm:flex-row gap-3.5 mt-10 w-full sm:w-auto">
        <a
          href="#ventures"
          className="px-7 py-3 rounded-full bg-gradient-to-br from-gold to-gold-dark text-white text-sm font-medium hover:shadow-[0_8px_24px_rgba(201,147,94,0.25)] hover:-translate-y-0.5 transition-all"
        >
          Explore Ventures
        </a>
        <a
          href="#contact"
          className="px-7 py-3 rounded-full border border-gold/25 text-gold text-sm font-medium hover:bg-gold/[0.08] transition-all"
        >
          Get in Touch
        </a>
      </div>

      <div className="hero-fade hidden sm:flex absolute bottom-10 flex-col items-center gap-2">
        <span className="text-[#333] text-[10px] tracking-[3px] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gold/40 to-transparent" />
      </div>
    </div>
  );
}
