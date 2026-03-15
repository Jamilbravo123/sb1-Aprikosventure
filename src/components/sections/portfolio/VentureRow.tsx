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
        group flex items-center gap-3 p-3.5 rounded-xl cursor-pointer
        bg-dark-secondary/40 border border-white/[0.08]
        hover:border-gold/20 hover:-translate-y-0.5
        hover:shadow-[0_6px_24px_rgba(0,0,0,0.2)]
        transition-all duration-300
        ${mirrored ? 'flex-row-reverse text-right' : ''}
      `}
    >
      <div className="w-[34px] h-[40px] rounded-lg bg-gold/10 border border-gold/[0.12] flex items-center justify-center flex-shrink-0 overflow-hidden">
        {venture.logo ? (
          <img src={venture.logo} alt={venture.name} className="w-full h-full object-contain p-1.5" />
        ) : (
          <span className="text-gold text-[11px] font-bold">{getInitials(venture.name)}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-white truncate">
          {mirrored && <span className="text-xs mr-1">{flag}</span>}
          {venture.name}
          {!mirrored && <span className="text-xs ml-1">{flag}</span>}
        </div>
        <div className="text-[11px] text-[#555] truncate">{venture.tagline}</div>
      </div>

      <div className={`flex gap-1.5 flex-shrink-0 ${mirrored ? 'mr-auto ml-0' : 'ml-auto mr-0'}`}>
        <span className="text-[8px] px-2 py-0.5 rounded-full bg-gold/10 text-gold font-medium">{industryText}</span>
        <span className="text-[8px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium">{statusText}</span>
      </div>

      <ExternalLink className={`w-3.5 h-3.5 text-[#333] group-hover:text-gold transition-colors flex-shrink-0 ${mirrored ? 'order-first' : ''}`} />
    </div>
  );
}
