import { useState } from 'react';
import { ArrowRight, Cpu } from 'lucide-react';
import { Venture, statusLabels, statusColors } from '../../types/dashboard';
import VentureModal from './VentureModal';

interface HubCardProps {
  venture: Venture;
}

export default function HubCard({ venture }: HubCardProps) {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="group w-full text-left p-6 rounded-xl 
          bg-slate-800/20 border border-dashed border-slate-700/50
          hover:bg-slate-800/30 hover:border-slate-600/50
          transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-900/20 
            flex items-center justify-center border border-purple-700/30">
            <Cpu className="w-6 h-6 text-purple-400" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h4 className="font-semibold text-white">
                {venture.name}
              </h4>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[venture.status]}`}>
                {statusLabels[venture.status]}
              </span>
            </div>
            <p className="text-sm text-slate-400">
              {venture.tagline}
            </p>
          </div>
          
          {/* Arrow */}
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 
            group-hover:translate-x-1 transition-all" />
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

