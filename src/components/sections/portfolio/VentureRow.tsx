import type { Venture } from '../../../types/dashboard';
import { countryFlags, industryLabels, statusLabels } from '../../../types/dashboard';
import { ExternalLink } from 'lucide-react';

interface VentureRowProps {
  venture: Venture;
  mirrored?: boolean;
}

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2);
}

export default function VentureRow({ venture, mirrored = false }: VentureRowProps) {
  const flag = countryFlags[venture.hqCountry] || '';
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
      className={`
        group py-5 cursor-pointer
        border-b border-white/[0.04] last:border-b-0
        transition-all duration-300
        ${mirrored ? 'text-right' : ''}
      `}
    >
      {/* Logo — fixed height zone */}
      <div className={`h-12 mb-3 flex items-center ${mirrored ? 'justify-end' : ''}`}>
        {venture.logo ? (
          <img
            src={venture.logo}
            alt={venture.name}
            className={`w-auto object-contain ${venture.id === 'shippingx' ? 'h-9 max-w-[170px]' : 'h-12 max-w-[200px]'}`}
          />
        ) : (
          <span className="text-gold text-xl font-bold tracking-wide">{getInitials(venture.name)}</span>
        )}
      </div>

      {/* Name + flag + link */}
      <div className={`flex items-center gap-2 mb-1 ${mirrored ? 'justify-end' : ''}`}>
        <span className="text-[17px] font-semibold text-white group-hover:text-gold-light transition-colors">
          {venture.name}
        </span>
        <span className="text-sm">{flag}</span>
        <ExternalLink className="w-3.5 h-3.5 text-[#333] group-hover:text-gold transition-colors" />
      </div>

      {/* Tagline */}
      <p className={`text-[14px] text-[#888] leading-relaxed mb-3 ${mirrored ? 'ml-auto' : ''}`}>
        {venture.tagline}
      </p>

      {/* Badges */}
      <div className={`flex gap-2 ${mirrored ? 'justify-end' : ''}`}>
        <span className="text-[11px] px-3 py-1 rounded-full bg-gold/10 text-gold font-medium">{industryText}</span>
        <span className="text-[11px] px-3 py-1 rounded-full bg-green-500/10 text-green-400 font-medium">{statusText}</span>
      </div>
    </div>
  );
}
