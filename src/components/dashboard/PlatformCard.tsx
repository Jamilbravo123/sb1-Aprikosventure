import { useState } from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { Venture, statusLabels, statusColors, countryFlags } from '../../types/dashboard';
import VentureModal from './VentureModal';

interface PlatformCardProps {
  venture: Venture;
}

export default function PlatformCard({ venture }: PlatformCardProps) {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="group w-full text-left p-8 rounded-2xl 
          bg-gradient-to-br from-slate-800/50 to-slate-900/50 
          border border-[#B8860B]/20 hover:border-[#B8860B]/40
          transition-all duration-300 hover:-translate-y-1"
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            {/* Platform badge */}
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-[#B8860B]" />
              <span className="text-xs font-medium text-[#B8860B] uppercase tracking-wider">
                Platform
              </span>
            </div>
            
            {/* Logo + Name */}
            <div className="flex items-center gap-4 mb-3">
              {venture.logo && (
                <img
                  src={venture.logo}
                  alt={venture.name}
                  loading="lazy"
                  className="h-10 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                />
              )}
              <h3 className="text-xl font-semibold text-white">
                {venture.name}
              </h3>
            </div>
            
            {/* Description */}
            <p className="text-slate-400 mb-4">
              {venture.tagline}
            </p>

            {/* Status + Geography */}
            <div className="flex items-center gap-4 text-sm">
              <span className={`px-2.5 py-1 rounded-full border text-xs ${statusColors[venture.status]}`}>
                {statusLabels[venture.status]}
              </span>
              <span className="text-slate-500">
                {countryFlags[venture.hqCountry]} Norway
              </span>
            </div>
          </div>
          
          {/* CTA */}
          <div className="flex-shrink-0 self-center">
            <span className="flex items-center gap-2 text-sm font-medium text-[#B8860B] group-hover:text-[#D4A84B] transition-colors">
              View platform
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
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

