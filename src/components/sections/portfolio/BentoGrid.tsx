import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../../lib/gsap';
import { portfolioVentures } from '../../../data/portfolio';
import BentoCard from './BentoCard';

export default function BentoGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!gridRef.current) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const cards = gridRef.current!.querySelectorAll('.bento-card');
      gsap.fromTo(cards,
        { y: 60, opacity: 0 },
        {
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            once: true,
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
        }
      );
    });
  }, { scope: gridRef });

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {portfolioVentures.map((venture) => (
        <BentoCard key={venture.id} venture={venture} />
      ))}
    </div>
  );
}
