import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../../lib/gsap';
import { portfolioCategories, getVenturesForCategory } from '../../../data/portfolio-categories';
import CodeEntropyStrip from './CodeEntropyStrip';
import type { Venture } from '../../../types/dashboard';
import { countryFlags, industryLabels, statusLabels } from '../../../types/dashboard';
import { ExternalLink, ChevronDown } from 'lucide-react';

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
  'nayapaisa': '',
  'pharmesa': '🇳🇴 🇵🇰',
  'shippingx': '🇳🇴 🇪🇺',
};

function VentureCard({ venture }: { venture: Venture }) {
  const flag = venture.id in ventureFlags ? ventureFlags[venture.id] : (countryFlags[venture.hqCountry] || '');
  const statusText = venture.statusText || statusLabels[venture.status];
  const industryText = industryLabels[venture.industry];

  const handleClick = () => {
    const websiteLink = venture.links?.find((l) => l.type === 'website');
    if (websiteLink) window.open(websiteLink.url, '_blank', 'noopener,noreferrer');
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
      <div className="relative h-20 mb-4 flex items-center gap-2">
        {venture.id === 'mashwara-ai' ? (
          <>
            <img src="/social/mashwara_Artboard2.png" alt="Mashwara" className="h-12 w-auto object-contain" />
            <img src="/social/mashwara_bot.png" alt="Mashwara Bot" className="h-16 w-auto object-contain" />
          </>
        ) : venture.logo ? (
          <img
            src={venture.logo}
            alt={venture.name}
            className={`w-auto max-w-full object-contain ${
              venture.id === 'shippingx' ? 'max-h-14' :
              venture.id === 'nayapaisa' ? 'max-h-16' :
              'max-h-20'
            }`}
          />
        ) : (
          <span className="text-gold text-4xl font-bold tracking-wide">{getInitials(venture.name)}</span>
        )}
        {venture.scriptTagline && (
          <span
            aria-hidden="true"
            className="font-script pointer-events-none absolute left-14 -bottom-1 text-[22px] leading-none text-gold-light/90 whitespace-nowrap"
            style={{
              transform: 'rotate(-6deg)',
              transformOrigin: 'left center',
              textShadow: '0 1px 2px rgba(0,0,0,0.6)',
            }}
          >
            {venture.scriptTagline}
          </span>
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

      {/* Flavor chip + launch caption */}
      {(venture.flavor || venture.launchDate) && (
        <div className="mt-3 flex flex-col items-start gap-1.5">
          {venture.flavor && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lime-400/[0.08] border border-lime-400/20 text-[10px] uppercase tracking-[0.12em] text-lime-300/90">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 shadow-[0_0_6px_rgba(163,230,53,0.6)]" />
              {venture.flavor}
            </span>
          )}
          {venture.launchDate && (
            <p className="font-display italic text-[11px] text-gold/60 tracking-[0.02em] pl-0.5">
              launching {venture.launchDate.toLowerCase()}
            </p>
          )}
        </div>
      )}

      {/* JV partner */}
      {venture.jvPartner && (
        <a
          href={venture.jvPartner.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-[#666] hover:text-gold-light transition-colors group/jv"
        >
          <span className="uppercase tracking-[0.08em] text-[#555]">JV with</span>
          {venture.jvPartner.logo ? (
            <img
              src={venture.jvPartner.logo}
              alt={venture.jvPartner.name}
              className="h-4 w-auto object-contain opacity-80 group-hover/jv:opacity-100 transition-opacity"
            />
          ) : (
            <span className="font-semibold text-gold/80 group-hover/jv:text-gold-light">
              {venture.jvPartner.name}
            </span>
          )}
          <ExternalLink className="w-2.5 h-2.5 text-[#444] group-hover/jv:text-gold transition-colors" />
        </a>
      )}
    </div>
  );
}

function CategoryRow({ config, ventures, index }: { config: typeof portfolioCategories[0]; ventures: Venture[]; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileContentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!rowRef.current) return;

    // Only animate on desktop
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const label = rowRef.current!.querySelector('.cat-label');
      const cards = rowRef.current!.querySelectorAll('.venture-card');

      gsap.set(label, { x: -15, opacity: 0 });
      gsap.set(cards, { x: 20, opacity: 0 });

      ScrollTrigger.create({
        trigger: rowRef.current!,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          if (label) {
            tl.to(label, { x: 0, opacity: 1, duration: 1, ease: 'power2.out', clearProps: 'transform,opacity' });
          }
          if (cards.length) {
            tl.to(cards, {
              x: 0, opacity: 1, duration: 0.9, stagger: 0.18,
              ease: 'power2.out', clearProps: 'transform,opacity',
            }, '-=0.6');
          }
        },
      });
    });
  }, { scope: rowRef });

  const toggleMobile = () => {
    if (!mobileContentRef.current) return;
    const el = mobileContentRef.current;

    if (!mobileOpen) {
      setMobileOpen(true);
      el.style.height = 'auto';
      const h = el.offsetHeight;
      el.style.height = '0px';
      gsap.to(el, { height: h, opacity: 1, duration: 0.4, ease: 'power2.out', onComplete: () => { el.style.height = 'auto'; } });
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => setMobileOpen(false) });
    }
  };

  return (
    <div ref={rowRef} className="py-6 lg:py-10 relative">
      {/* Desktop layout */}
      <div className="hidden lg:flex lg:flex-row lg:gap-0">
        <div className="cat-label lg:w-[220px] flex-shrink-0 lg:pr-8 lg:self-center">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg text-gold">{config.icon}</span>
            <h3 className="font-display text-xl font-bold text-white">{config.title}</h3>
          </div>
          <p className="text-[12px] text-[#666] leading-relaxed">{config.description}</p>
        </div>
        <div className="flex-1 flex flex-nowrap items-start gap-4 lg:ml-6 lg:pl-6 lg:border-l-2 lg:border-gold/30 lg:shadow-[inset_2px_0_12px_rgba(201,147,94,0.08)]">
          {ventures.map((v) => (
            <VentureCard key={v.id} venture={v} />
          ))}
        </div>
      </div>

      {/* Mobile accordion */}
      <div className="lg:hidden">
        <button
          onClick={toggleMobile}
          className="w-full flex items-center justify-between py-3 px-4 -mx-4 rounded-lg border border-white/[0.06] hover:border-gold/20 hover:bg-white/[0.02] transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg text-gold">{config.icon}</span>
            <h3 className="font-display text-xl font-bold text-white">{config.title}</h3>
          </div>
          <ChevronDown className={`w-5 h-5 text-gold/80 transition-transform duration-300 ${mobileOpen ? 'rotate-180' : ''}`} />
        </button>
        <p className="text-[12px] text-[#666] leading-relaxed mb-2">{config.description}</p>

        <div ref={mobileContentRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
          <div className="space-y-1 pt-3">
            {ventures.map((v) => (
              <VentureCard key={v.id} venture={v} />
            ))}
          </div>
        </div>
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
