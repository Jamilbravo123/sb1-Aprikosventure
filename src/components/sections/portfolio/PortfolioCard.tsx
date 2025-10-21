import React, { useState, useEffect } from 'react';
import { ExternalLink, CircleDot, X } from 'lucide-react';
import { PortfolioItem } from './types';
import { colors } from '../../../constants/colors';

interface PortfolioCardProps {
  item: PortfolioItem;
  isActive?: boolean;
}

export default function PortfolioCard({ item, isActive = false }: PortfolioCardProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [removeFilter, setRemoveFilter] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isActive) {
      timer = setTimeout(() => {
        setRemoveFilter(true);
      }, 1000);
    } else {
      setRemoveFilter(false);
    }
    return () => clearTimeout(timer);
  }, [isActive]);

  const handleClick = () => {
    if (item.comingSoon) {
      setShowPopup(true);
    } else if (item.link) {
      window.open(item.link, '_blank');
    }
  };

  const isWeb3Section = item.tags.some(tag => ['Web3', 'Blockchain', 'DeFi'].includes(tag));
  const isLogo = item.isLogo || isWeb3Section;
  const isMashwaraLogo = item.title === 'Mashwara AI';
  const isJuniAiLogo = item.title === 'Juni AI';
  const isShippingXLogo = item.title === 'ShippingX';

  return (
    <>
      <div 
        className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer w-full flex flex-col hover:ring-1 hover:ring-blue-400"
        onClick={handleClick}
      >
        <div className={`aspect-[16/9] overflow-hidden relative ${isMashwaraLogo ? 'bg-slate-900' : (isJuniAiLogo ? 'flex items-center justify-center p-4' : (isLogo ? 'bg-slate-900 flex items-center justify-center p-4' : 'bg-slate-900'))}`} style={isJuniAiLogo ? { backgroundColor: '#194b6a' } : {}}>
          <img
            src={item.image}
            alt={item.title}
            className={`h-full w-full ${isMashwaraLogo ? 'object-cover' : (isLogo ? 'object-contain max-h-full' : 'object-cover')} ${
              removeFilter ? 'opacity-100 mix-blend-normal' : 'opacity-90 md:opacity-70 mix-blend-luminosity'
            } transition-all duration-500 group-hover:opacity-100 group-hover:mix-blend-normal group-hover:scale-105`}
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent ${
            removeFilter ? 'opacity-0' : 'opacity-40 md:opacity-60'
          } ${isLogo ? 'group-hover:opacity-10' : 'transition-opacity duration-300 group-hover:opacity-20'}`} />
        </div>
        <div className="p-4 flex-1 flex flex-col bg-white transition-colors duration-300 group-hover:bg-slate-50">
          <div className="flex items-center justify-between mb-2">
            <h3 
              className={`text-base font-semibold leading-6 text-slate-900 group-hover:text-[${colors.primary.blue}] transition-colors`}
              dangerouslySetInnerHTML={{ __html: item.title }}
            />
          </div>
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full mb-2 transition-all duration-300 ${
            item.status === 'active' 
              ? 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100' 
              : 'bg-amber-50 text-amber-700 group-hover:bg-amber-100'
          }`}>
            <CircleDot className="h-3 w-3" />
            {item.status === 'active' ? 'Active' : 'Development'}
          </span>
          <p className="text-sm leading-5 text-slate-600">{item.description}</p>
          {(item.link || item.comingSoon) && (
            <div className={`mt-3 flex items-center gap-1 text-[${colors.primary.blue}] group-hover:text-[${colors.primary.navy}] transition-colors`}>
              <span className="text-xs font-medium">
                {item.comingSoon ? 'Coming Soon' : 'Learn more'}
              </span>
              <ExternalLink className="w-3 h-3 transform transition-transform group-hover:translate-x-1" />
            </div>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPopup(false)}>
          <div 
            className="bg-white rounded-2xl p-8 max-w-md mx-4 relative transform transition-all duration-300 scale-100 opacity-100"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowPopup(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 
              className="text-2xl font-semibold text-slate-900 mb-4"
              dangerouslySetInnerHTML={{ __html: item.title }}
            />
            <p className="text-slate-600 mb-6">
              This project is currently under development. Stay tuned for updates!
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CircleDot className="w-4 h-4 text-amber-500" />
              <span>Expected launch: Coming soon</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}