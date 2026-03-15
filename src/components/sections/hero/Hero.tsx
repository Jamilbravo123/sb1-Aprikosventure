import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../../lib/gsap';
import HeroBackground from './HeroBackground';
import HeroContent from './HeroContent';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Fade out and scale on scroll
    gsap.to(containerRef.current.querySelector('.hero-inner'), {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      opacity: 0,
      scale: 0.95,
      y: -50,
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      <HeroBackground />
      <div className="hero-inner relative z-10 flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-32 lg:px-8">
          <HeroContent />
        </div>
      </div>
    </div>
  );
}
