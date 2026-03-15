import { useRef, useState } from 'react';
import { gsap } from '../../../lib/gsap';
import type { Venture } from '../../../types/dashboard';
import type { CategoryConfig } from '../../../data/portfolio-categories';
import VentureRow from './VentureRow';

interface CategoryColumnProps {
  config: CategoryConfig;
  ventures: Venture[];
  mirrored?: boolean;
}

export default function CategoryColumn({ config, ventures, mirrored = false }: CategoryColumnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (!panelRef.current || !cardsRef.current) return;

    if (!isOpen) {
      setIsOpen(true);
      gsap.fromTo(panelRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.5, ease: 'power2.out' },
      );
      gsap.from(cardsRef.current.children, {
        y: 12, opacity: 0, duration: 0.4,
        stagger: 0.1, ease: 'power2.out', delay: 0.1,
      });
    } else {
      gsap.to(panelRef.current, {
        height: 0, opacity: 0, duration: 0.4, ease: 'power2.in',
        onComplete: () => setIsOpen(false),
      });
    }
  };

  return (
    <div
      className={`p-7 cursor-pointer group ${mirrored ? 'text-right' : ''}`}
      onClick={toggle}
    >
      <div className={`${mirrored ? 'flex flex-col items-end' : ''}`}>
        <div className="w-10 h-10 rounded-[10px] bg-gold/[0.08] border border-gold/[0.12] flex items-center justify-center text-base mb-3.5 group-hover:bg-gold/[0.15] group-hover:border-gold/30 group-hover:shadow-[0_0_24px_rgba(201,147,94,0.15)] transition-all">
          {config.icon}
        </div>
        <h3 className="font-display text-[22px] font-bold mb-1.5 group-hover:text-gold-light transition-colors">
          {config.title}
        </h3>
        <p className="text-[#555] text-[12px] leading-relaxed max-w-[300px]">
          {config.description}
        </p>
        <div className={`inline-flex items-center gap-1.5 text-gold text-xs font-medium mt-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ${isOpen ? '!opacity-100 !translate-y-0' : ''}`}>
          {isOpen ? 'Close' : 'Explore ventures'} <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>

      <div ref={panelRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <div ref={cardsRef} className="pt-6 space-y-2" onClick={(e) => e.stopPropagation()}>
          {ventures.map((v) => (
            <VentureRow key={v.id} venture={v} mirrored={mirrored} />
          ))}
        </div>
      </div>
    </div>
  );
}
