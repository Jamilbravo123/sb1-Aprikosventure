import type { Venture } from '../../../types/dashboard';
import {
  industryLabels,
  industryColors,
  statusLabels,
  statusColors,
  countryFlags,
} from '../../../types/dashboard';
import { ExternalLink } from 'lucide-react';

interface BentoCardProps {
  venture: Venture;
}

export default function BentoCard({ venture }: BentoCardProps) {
  const websiteUrl = venture.links?.find(l => l.type === 'website')?.url;
  const flag = countryFlags[venture.hqCountry];
  const highlights = venture.details?.highlights ?? [];

  const handleOpen = () => {
    if (websiteUrl) {
      window.open(websiteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  };

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={`${venture.name} — ${venture.tagline}`}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      className="bento-card group flex flex-col rounded-2xl bg-[#1E293B]/50 backdrop-blur-sm border border-slate-700/30 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:border-gold/40 hover:shadow-md hover:shadow-gold/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-primary"
    >
      {/* Logo zone */}
      {venture.logo && (
        <div className="px-6 pt-6 pb-4">
          <img
            src={venture.logo}
            alt=""
            loading="lazy"
            className="h-14 max-w-[180px] object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      )}

      {/* Separator */}
      <div className="h-px bg-slate-700/40 mx-6" />

      {/* Content */}
      <div className="flex flex-col flex-1 px-6 pt-4 pb-5">
        {/* Name + flag */}
        <h3 className="font-display text-lg font-bold text-white text-balance">
          {flag && <span className="mr-1.5">{flag}</span>}
          {venture.name}
        </h3>

        {/* Tagline */}
        <p className="mt-1.5 text-sm text-slate-400 text-pretty leading-relaxed">
          {venture.tagline}
        </p>

        {/* Highlight pills */}
        {highlights.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {highlights.map((h) => (
              <span
                key={h}
                className="text-xs text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded"
              >
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${industryColors[venture.industry]}`}>
              {industryLabels[venture.industry]}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${statusColors[venture.status]}`}>
              {statusLabels[venture.status]}
            </span>
          </div>

          {websiteUrl && (
            <ExternalLink className="size-4 text-slate-600 group-hover:text-gold transition-colors duration-300 flex-shrink-0" />
          )}
        </div>
      </div>
    </div>
  );
}
