import { X, ExternalLink, Calendar, TrendingUp, MapPin, Target } from 'lucide-react';
import { VentureOpportunity } from '../../types/dashboard';
import Badge from '../common/Badge';
import Portal from '../common/Portal';
import { INVESTOR_CLUB_COPY } from '../../constants/copy';

interface VentureModalProps {
  venture: VentureOpportunity;
  isOpen: boolean;
  onClose: () => void;
}

export default function VentureModal({ venture, isOpen, onClose }: VentureModalProps) {
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-emerald-600 bg-emerald-50';
      case 'closed': return 'text-slate-600 bg-slate-100';
      case 'upcoming': return 'text-blue-600 bg-blue-50';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return '🟢 Open for Investment';
      case 'closed': return '⚪ Closed';
      case 'upcoming': return '🔵 Coming Soon';
      default: return status;
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={onClose}
        />
        
        {/* Modal - centered and larger */}
        <div 
          className="relative bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] 
            overflow-y-auto animate-scale-up z-10 border border-slate-700"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-start justify-between rounded-t-2xl backdrop-blur-sm">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {venture.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {venture.category.map((cat) => (
                <Badge key={cat} variant="primary" size="sm">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">
              About
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {venture.description}
            </p>
          </div>

          {/* Funding Information */}
          {venture.fundingInfo && (
            <div className="bg-gradient-to-br from-blue-900/20 to-slate-900/30 p-5 rounded-xl border border-blue-700/30">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[#B8860B]" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                  Funding Information
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Current Round</p>
                  <p className="text-base font-semibold text-white">
                    {venture.fundingInfo.currentRound}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Target</p>
                  <p className="text-base font-semibold text-white">
                    {venture.fundingInfo.target}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Status</p>
                  <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(venture.fundingInfo.status)}`}>
                    {getStatusText(venture.fundingInfo.status)}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Min. Investment</p>
                  <p className="text-base font-semibold text-white">
                    {venture.fundingInfo.minInvestment}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Key Highlights */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-[#B8860B]" />
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                Key Highlights
              </h3>
            </div>
            <div className="space-y-3 bg-slate-900/30 p-4 rounded-xl border border-slate-700/30">
              <div className="flex items-start gap-3">
                <span className="text-slate-400 font-medium min-w-[80px]">Stage:</span>
                <span className="text-white">{venture.highlights.stage}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <span className="text-slate-400 font-medium min-w-[80px]">Geography:</span>
                <span className="text-white">{venture.highlights.geography}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-slate-400 font-medium min-w-[80px]">Thesis:</span>
                <span className="text-white">{venture.highlights.thesis}</span>
              </div>
            </div>
          </div>

          {/* Latest Update */}
          {venture.latestUpdate && (
            <div className="bg-emerald-900/20 border border-emerald-700/30 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-emerald-300 mb-1">
                    {venture.latestUpdate.date}
                  </p>
                  <p className="text-sm text-emerald-400 leading-relaxed">
                    {venture.latestUpdate.text}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
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
        </div>
      </div>
    </div>
    </Portal>
  );
}

