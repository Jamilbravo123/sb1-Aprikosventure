import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { 
  Venture, 
  statusLabels, 
  industryLabels,
  statusColors,
  industryColors
} from '../../types/dashboard';
import { getChildVentures } from '../../data/ventures.mock';
import VentureModal from './VentureModal';

interface VentureCardProps {
  venture: Venture;
}

export default function VentureCard({ venture }: VentureCardProps) {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="group w-full h-full text-left p-6 rounded-2xl bg-slate-800/30 border border-slate-700/30
          hover:bg-slate-800/50 hover:border-slate-600/50 transition-all duration-300
          hover:-translate-y-1 flex flex-col"
      >
        {/* Logo */}
        {venture.logo && (
          <div className="h-16 mb-3 flex items-center">
            <img
              src={venture.logo}
              alt={venture.name}
              loading="lazy"
              className="max-h-14 max-w-[140px] object-contain opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </div>
        )}
        
        {/* Child venture logos (for platforms) */}
        {venture.childIds && venture.childIds.length > 0 && (
          <div className="flex items-center gap-1.5 mb-4">
            <span className="text-[10px] text-slate-500 uppercase tracking-wide">includes</span>
            {getChildVentures(venture.id).slice(0, 3).map((child) => (
              child.logo && (
                <img
                  key={child.id}
                  src={child.logo}
                  alt={child.name}
                  title={child.name}
                  loading="lazy"
                  className="w-6 h-6 rounded object-contain bg-slate-700/50 p-0.5"
                />
              )
            ))}
          </div>
        )}
        
        {/* Name */}
        <h3 className="text-lg font-semibold text-white mb-2">
          {venture.name}
        </h3>
        
        {/* Description - two lines max */}
        <p className="text-sm text-slate-400 mb-4 line-clamp-2 min-h-[40px]">
          {venture.tagline}
        </p>

        {/* Two badges: Industry + Status */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs px-2.5 py-1 rounded-full border ${industryColors[venture.industry]}`}>
            {industryLabels[venture.industry]}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full border ${statusColors[venture.status]}`}>
            {statusLabels[venture.status]}
          </span>
        </div>

        {/* CTA - pushed to bottom */}
        <div className="mt-auto">
          <div className="flex items-center gap-1 text-sm font-medium text-[#B8860B] group-hover:text-[#D4A84B] transition-colors">
            View overview
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </button>

      {/* Modal */}
      <VentureModal
        venture={venture}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
