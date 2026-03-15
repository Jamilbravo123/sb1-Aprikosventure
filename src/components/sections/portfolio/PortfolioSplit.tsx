import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../../lib/gsap';
import { portfolioCategories, getVenturesForCategory } from '../../../data/portfolio-categories';
import CodeEntropyStrip from './CodeEntropyStrip';
import type { Venture } from '../../../types/dashboard';
import { countryFlags, industryLabels, statusLabels } from '../../../types/dashboard';
import { ExternalLink } from 'lucide-react';

function statusBadgeClass(status: string, statusText?: string): string {
  const text = statusText?.toLowerCase() || status;
  if (text.includes('live') && !text.includes('beta')) return 'bg-emerald-500/10 text-emerald-400';
  if (text.includes('beta')) return 'bg-amber-500/10 text-amber-400';
  if (text.includes('building')) return 'bg-blue-500/10 text-blue-400';
  if (text.includes('launching')) return 'bg-purple-500/10 text-purple-400';
  if (text.includes('pre-launch')) return 'bg-orange-500/10 text-orange-400';
  if (text.includes('scaling')) return 'bg-cyan-500/10 text-cyan-400';
  return 'bg-white/10 text-white/60';
}

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2);
}

const ventureFlags: Record<string, string> = {
  'aprikos-medical': '🇳🇴 🌍',
  'pharmesa': '🇳🇴 🇵🇰',
  'shippingx': '🇳🇴 🇪🇺',
};

function VentureCard({ venture }: { venture: Venture }) {
  const flag = ventureFlags[venture.id] || countryFlags[venture.hqCountry] || '';
  const statusText = venture.statusText || statusLabels[venture.status];
  const industryText = industryLabels[venture.industry];

  const handleClick = () => {
    const websiteLink = venture.links?.find((l) => l.type === 'website');
    if (websiteLink) window.open(websiteLink.url, '_blank', 'noopener');
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      className="venture-card group w-full sm:w-[280px] flex-shrink-0 cursor-pointer py-5 px-6 rounded-xl hover:bg-white/[0.03] transition-all"
    >
      {/* Logo */}
      <div className="h-20 mb-4 flex items-center gap-2">
        {venture.id === 'mashwara-ai' ? (
          <>
            <img src="/social/mashwara_Artboard2.png" alt="Mashwara" className="h-12 w-auto object-contain" />
            <img src="/social/mashwara_bot.png" alt="Mashwara Bot" className="h-16 w-auto object-contain" />
          </>
        ) : venture.logo ? (
          <img
            src={venture.logo}
            alt={venture.name}
            className="max-h-20 w-auto max-w-full object-contain"
          />
        ) : (
          <span className="text-gold text-4xl font-bold tracking-wide">{getInitials(venture.name)}</span>
        )}
      </div>

      {/* Name */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[16px] font-semibold text-white group-hover:text-gold-light transition-colors">
          {venture.name}
        </span>
        <span className="text-sm">{flag}</span>
        <ExternalLink className="w-3 h-3 text-[#333] group-hover:text-gold transition-colors" />
      </div>

      {/* Tagline */}
      <p className="text-[13px] text-[#777] leading-relaxed">{venture.tagline}</p>
    </div>
  );
}

function CategoryRow({ config, ventures, index }: { config: typeof portfolioCategories[0]; ventures: Venture[]; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!rowRef.current) return;

    const label = rowRef.current.querySelector('.cat-label');
    const divider = rowRef.current.querySelector('.cat-divider');
    const cards = rowRef.current.querySelectorAll('.venture-card');

    // Animate label and cards on scroll — divider is always visible (no animation)
    gsap.set(label, { x: -15, opacity: 0 });
    gsap.set(cards, { x: 20, opacity: 0 });

    ScrollTrigger.create({
      trigger: rowRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();

        if (label) {
          tl.to(label, { x: 0, opacity: 1, duration: 1, ease: 'power2.out', clearProps: 'transform,opacity' });
        }

        if (cards.length) {
          tl.to(cards, {
            x: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.18,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          }, '-=0.6');
        }
      },
    });
  }, { scope: rowRef });

  return (
    <div
      ref={rowRef}
      className="flex flex-col lg:flex-row gap-6 lg:gap-0 py-10 relative"
    >
      {/* Category label — left side */}
      <div className="cat-label lg:w-[220px] flex-shrink-0 lg:pr-8 lg:self-center">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-lg text-gold">{config.icon}</span>
          <h3 className="font-display text-xl font-bold text-white">{config.title}</h3>
        </div>
        <p className="text-[12px] text-[#666] leading-relaxed">{config.description}</p>
      </div>

      {/* Ventures — flowing right */}
      <div className="flex-1 flex flex-wrap lg:flex-nowrap items-start gap-4 lg:ml-6 lg:pl-6 lg:border-l-2 lg:border-gold/30 lg:shadow-[inset_2px_0_12px_rgba(201,147,94,0.08)]">
        {ventures.map((v) => (
          <VentureCard key={v.id} venture={v} />
        ))}
      </div>
    </div>
  );
}

export default function PortfolioSplit() {
  const categories = portfolioCategories.map((cat) => ({
    config: cat,
    ventures: getVenturesForCategory(cat.id) as Venture[],
  }));

  return (
    <div>
      {categories.map((cat, i) => (
        <div key={cat.config.id}>
          <CategoryRow config={cat.config} ventures={cat.ventures} index={i} />
          {i < categories.length - 1 && (
            <div className="relative h-px mx-8">
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(201,147,94,0.2) 20%, rgba(201,147,94,0.35) 50%, rgba(201,147,94,0.2) 80%, transparent 100%)',
                }}
              />
              <div
                className="absolute inset-0 animate-pulse"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(201,147,94,0.1) 30%, rgba(201,147,94,0.2) 50%, rgba(201,147,94,0.1) 70%, transparent 100%)',
                  filter: 'blur(2px)',
                }}
              />
            </div>
          )}
        </div>
      ))}
      <CodeEntropyStrip />
    </div>
  );
}
