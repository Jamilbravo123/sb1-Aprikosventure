import { useState } from 'react';
import { ExternalLink, Info } from 'lucide-react';
import { VentureOpportunity } from '../../types/dashboard';
import { INVESTOR_CLUB_COPY } from '../../constants/copy';
import VentureModal from './VentureModal';

interface VentureCardProps {
  venture: VentureOpportunity;
}

export default function VentureCard({ venture }: VentureCardProps) {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="group flex flex-col items-center animate-float-gentle transition-all duration-300 hover:-translate-y-2">
      
      {/* Logo - Floating on dark bg */}
      {venture.logo && (
        <div className="mb-6 flex items-center justify-center h-32 w-full">
          <img 
            src={venture.logo} 
            alt={`${venture.name} logo`} 
            className="max-h-28 max-w-full object-contain opacity-80 group-hover:opacity-100 
              transition-all group-hover:scale-105 group-hover:drop-shadow-[0_0_30px_rgba(184,134,11,0.3)]"
          />
        </div>
      )}
      
      {/* Venture Name */}
      <h3 className="text-xl font-bold text-white text-center leading-tight mb-6">
        {venture.name}
      </h3>

      {/* Actions Section */}
      <div className="w-full max-w-[240px] mx-auto space-y-4">
        {/* Overview - Primary action */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 
            bg-gradient-to-r from-[#B8860B] to-[#a67a0a] text-white rounded-lg 
            font-semibold hover:from-[#a67a0a] hover:to-[#B8860B] transition-all 
            shadow-md hover:shadow-lg hover:shadow-[#B8860B]/20 group/btn text-sm"
        >
          <Info className="w-4 h-4" />
          Overview
        </button>

        {/* Access via BalderX - Secondary action */}
        <a
          href={venture.balderxUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Access ${venture.name} via BalderX (external platform)`}
          className="flex items-center justify-center gap-2 w-full px-6 py-2.5 
            bg-slate-700/50 text-slate-300 rounded-lg font-medium hover:bg-slate-600/50 
            hover:text-white transition-all text-sm border border-slate-600/50"
        >
          Access via BalderX
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <p className="text-[10px] text-center text-slate-400 leading-snug mt-4 px-2">
          {INVESTOR_CLUB_COPY.vtRequirement}
        </p>
      </div>

      {/* Modal */}
      <VentureModal
        venture={venture}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}

