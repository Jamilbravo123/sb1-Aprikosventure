import { useState } from 'react';
import { X, ExternalLink, MapPin, ChevronDown, ChevronUp, Briefcase, Globe, Building2, ArrowLeft, ArrowRight } from 'lucide-react';
import { 
  Venture, 
  statusLabels, 
  ownershipLabels,
  statusColors,
  ownershipColors,
  countryFlags,
  kindLabels
} from '../../types/dashboard';
import { getChildVentures, ventures } from '../../data/ventures.mock';
import Portal from '../common/Portal';
import { INVESTOR_CLUB_COPY } from '../../constants/copy';

interface VentureModalProps {
  venture: Venture;
  isOpen: boolean;
  onClose: () => void;
}

// Sub-component for Portfolio Companies (clickable)
function PortfolioCompanies({ 
  ventureId, 
  onSelectChild 
}: { 
  ventureId: string; 
  onSelectChild: (venture: Venture) => void;
}) {
  const childVentures = getChildVentures(ventureId);
  
  if (childVentures.length === 0) return null;
  
  return (
    <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/30">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
        <Building2 className="w-4 h-4" />
        Portfolio Companies
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {childVentures.map((child) => (
          <button
            key={child.id}
            onClick={() => onSelectChild(child)}
            className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30 
              hover:border-[#B8860B]/50 hover:bg-slate-800/70 transition-all text-left group"
          >
            <div className="flex items-start gap-3">
              {child.logo && (
                <img
                  src={child.logo}
                  alt={child.name}
                  loading="lazy"
                  className="w-8 h-8 object-contain rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white text-sm mb-0.5 group-hover:text-[#D4A84B] transition-colors">
                  {child.name}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {child.tagline}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusColors[child.status]}`}>
                    {statusLabels[child.status]}
                  </span>
                  <span className="text-xs text-slate-500">
                    {countryFlags[child.hqCountry]}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#B8860B] mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  View details
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function VentureModal({ venture: initialVenture, isOpen, onClose }: VentureModalProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [currentVenture, setCurrentVenture] = useState<Venture>(initialVenture);
  const [parentVenture, setParentVenture] = useState<Venture | null>(null);
  
  // Reset state when modal opens with new venture
  const handleClose = () => {
    setCurrentVenture(initialVenture);
    setParentVenture(null);
    setShowDetails(false);
    onClose();
  };

  // Navigate to child venture
  const handleSelectChild = (child: Venture) => {
    setParentVenture(currentVenture);
    setCurrentVenture(child);
    setShowDetails(false);
  };

  // Navigate back to parent
  const handleBack = () => {
    if (parentVenture) {
      setCurrentVenture(parentVenture);
      setParentVenture(null);
      setShowDetails(false);
    }
  };
  
  if (!isOpen) return null;

  // Use currentVenture for display
  const venture = currentVenture;

  const countryName = (code: string) => {
    const names: Record<string, string> = {
      NO: 'Norway',
      PK: 'Pakistan',
      AE: 'UAE',
      DE: 'Germany',
      UK: 'United Kingdom',
      US: 'United States'
    };
    return names[code] || code;
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={handleClose}
        />
        
        {/* Modal */}
        <div 
          className="relative bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh]
            overflow-y-auto overflow-x-hidden animate-scale-up z-10 border border-slate-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Back Button (when viewing child) */}
          {parentVenture && (
            <button
              onClick={handleBack}
              className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 
                bg-slate-700/80 hover:bg-slate-600/80 rounded-lg text-sm text-slate-300 
                hover:text-white transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {parentVenture.name}
            </button>
          )}

          {/* Header */}
          <div className={`sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-start justify-between rounded-t-2xl backdrop-blur-sm ${parentVenture ? 'pt-14' : ''}`}>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {venture.name}
              </h2>
              <div className="flex flex-wrap gap-2">
                {/* Kind Badge */}
                {venture.kind !== 'venture' && (
                  <span className="text-xs px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 border border-purple-700/30">
                    {kindLabels[venture.kind]}
                  </span>
                )}
                {/* Ownership Badge */}
                <span className={`text-xs px-3 py-1 rounded-full border ${ownershipColors[venture.ownershipType]}`}>
                  {ownershipLabels[venture.ownershipType]}
                </span>
                {/* Status Badge */}
                <span className={`text-xs px-3 py-1 rounded-full border ${statusColors[venture.status]}`}>
                  {statusLabels[venture.status]}
                </span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-slate-300" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Tagline/Description */}
            <div>
              <p className="text-slate-300 leading-relaxed text-lg">
                {venture.tagline}
              </p>
            </div>

            {/* Key Info Grid */}
            <div className="grid grid-cols-2 gap-4 bg-slate-900/30 p-4 rounded-xl border border-slate-700/30">
              {/* Geography */}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#B8860B] mt-1" />
                <div>
                  <p className="text-xs text-slate-400 mb-1">Headquarters</p>
                  <p className="text-white font-medium">
                    {countryFlags[venture.hqCountry]} {countryName(venture.hqCountry)}
                  </p>
                </div>
              </div>
              
              {/* Markets */}
              {venture.markets && venture.markets.length > 0 && (
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-[#B8860B] mt-1" />
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Markets</p>
                    <p className="text-white font-medium">
                      {venture.markets.join(', ')}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Aprikos Role */}
              <div className="flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-[#B8860B] mt-1" />
                <div>
                  <p className="text-xs text-slate-400 mb-1">Aprikos Role</p>
                  <p className="text-white font-medium">
                    {venture.aprikosRole}
                  </p>
                </div>
              </div>
            </div>

            {/* Highlights */}
            {venture.details?.highlights && venture.details.highlights.length > 0 && (
              <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/30">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Highlights
                </h3>
                <ul className="space-y-2">
                  {venture.details.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300">
                      <span className="w-1.5 h-1.5 bg-[#B8860B] rounded-full" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Portfolio Companies (for platforms with children) */}
            {(venture.kind === 'platform' || venture.childIds?.length) && (
              <PortfolioCompanies 
                ventureId={venture.id} 
                onSelectChild={handleSelectChild}
              />
            )}

            {/* Details Accordion - Ownership % and Founded Year only */}
            {venture.details && (venture.details.ownershipPercent || venture.details.foundedYear) && (
              <div className="border border-slate-700/30 rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full flex items-center justify-between p-4 text-left 
                    hover:bg-slate-700/30 transition-colors"
                >
                  <span className="text-sm font-medium text-slate-300">
                    Details
                  </span>
                  {showDetails ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                
                {showDetails && (
                  <div className="p-4 pt-0 border-t border-slate-700/30 bg-slate-900/20">
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      {venture.details.ownershipPercent && (
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Ownership</p>
                          <p className="text-white font-semibold">
                            {venture.details.ownershipPercent}%
                          </p>
                        </div>
                      )}
                      {venture.details.foundedYear && (
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Founded</p>
                          <p className="text-white font-semibold">
                            {venture.details.foundedYear}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Links */}
            {venture.links && venture.links.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {venture.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 
                      text-slate-300 rounded-lg text-sm hover:bg-slate-600/50 
                      hover:text-white transition-all"
                  >
                    {link.label}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            )}

            {/* CTA */}
            {venture.balderxUrl && (
              <div className="pt-4 border-t border-slate-700">
                <a
                  href={venture.balderxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 
                    bg-gradient-to-r from-[#B8860B] to-[#a67a0a] text-white rounded-xl 
                    font-semibold hover:from-[#a67a0a] hover:to-[#B8860B] transition-all 
                    shadow-lg hover:shadow-xl hover:shadow-[#B8860B]/30 group"
                >
                  Access via BalderX (external)
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </a>
                
                <p className="text-xs text-center text-slate-400 mt-3 leading-relaxed">
                  {INVESTOR_CLUB_COPY.vtRequirement}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
