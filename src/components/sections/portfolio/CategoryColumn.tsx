import { useRef, useState, useCallback } from 'react';
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

  const toggle = useCallback(() => {
    if (!panelRef.current) return;
    const panel = panelRef.current;

    if (!isOpen) {
      setIsOpen(true);
      // First set to auto to measure height
      panel.style.height = 'auto';
      const fullHeight = panel.offsetHeight;
      panel.style.height = '0px';

      gsap.to(panel, {
        height: fullHeight,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          panel.style.height = 'auto';
        },
      });

      // Stagger children
      const cards = panel.querySelectorAll('.venture-row');
      gsap.fromTo(cards,
        { y: 16, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.4,
          stagger: 0.08, ease: 'power2.out', delay: 0.15,
          clearProps: 'transform',
        },
      );
    } else {
      gsap.to(panel, {
        height: 0, opacity: 0, duration: 0.35, ease: 'power2.in',
        onComplete: () => setIsOpen(false),
      });
    }
  }, [isOpen]);

  return (
    <div
      className={`p-7 cursor-pointer group ${mirrored ? 'text-right' : ''}`}
      onClick={toggle}
    >
      <div className={`${mirrored ? 'flex flex-col items-end' : ''}`}>
        <div className="w-10 h-10 rounded-[10px] bg-gold/[0.08] border border-gold/[0.12] flex items-center justify-center text-base mb-3.5 group-hover:bg-gold/[0.15] group-hover:border-gold/30 group-hover:shadow-[0_0_24px_rgba(201,147,94,0.15)] transition-all">
          {config.icon}
        </div>
        <h3 className="font-display text-[22px] font-bold mb-1.5 text-white group-hover:text-gold-light transition-colors">
          {config.title}
        </h3>
        <p className="text-[#888] text-[13px] leading-relaxed max-w-[300px]">
          {config.description}
        </p>
        <div className={`inline-flex items-center gap-1.5 text-gold text-xs font-medium mt-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ${isOpen ? '!opacity-100 !translate-y-0' : ''}`}>
          {isOpen ? 'Close' : 'Explore ventures'} <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>

      <div ref={panelRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <div className="pt-5 space-y-3" onClick={(e) => e.stopPropagation()}>
          {ventures.map((v) => (
            <div key={v.id} className="venture-row">
              <VentureRow venture={v} mirrored={mirrored} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
