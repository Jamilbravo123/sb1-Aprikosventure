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
    let timer: NodeJS.Timeout;
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

  return (
    <>
      <div 
        className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer w-full flex flex-col hover:ring-2 hover:ring-blue-400"
        onClick={handleClick}
      >
        <div className="aspect-[16/9] overflow-hidden bg-slate-900 relative">
          <img
            src={item.image}
            alt={item.title}
            className={`h-full w-full object-contain object-center p-4 ${
              removeFilter ? 'opacity-100 mix-blend-normal' : 'opacity-90 md:opacity-70 mix-blend-luminosity'
            } transition-all duration-500 group-hover:opacity-100 group-hover:mix-blend-normal group-hover:scale-105`}
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent ${
            removeFilter ? 'opacity-0' : 'opacity-40 md:opacity-80'
          } transition-opacity duration-300 group-hover:opacity-20`} />
        </div>
        <div className="p-6 flex-1 flex flex-col bg-white transition-colors duration-300 group-hover:bg-slate-50">
          <div className="flex items-center justify-between mb-3">
            <h3 
              className={`text-xl font-semibold leading-6 text-slate-900 group-hover:text-[${colors.primary.blue}] transition-colors`}
              dangerouslySetInnerHTML={{ __html: item.title }}
            />
          </div>
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full mb-3 transition-all duration-300 ${
            item.title.includes('Venturetoken')
              ? 'bg-blue-50 text-blue-700 group-hover:bg-blue-100 group-hover:shadow-sm'
              : item.status === 'active' 
                ? 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 group-hover:shadow-sm' 
                : 'bg-amber-50 text-amber-700 group-hover:bg-amber-100 group-hover:shadow-sm'
          }`}>
            <CircleDot className="h-3 w-3" />
            {item.title.includes('Venturetoken') 
              ? 'Partnership'
              : item.status === 'active' 
                ? 'Launched' 
                : item.title.includes('Bldrx') 
                  ? 'Launching Soon' 
                  : 'Development'
            }
          </span>
          <p className="text-base leading-6 text-slate-600">{item.description}</p>
          {(item.link || item.comingSoon) && (
            <div className={`mt-4 flex items-center gap-2 text-[${colors.primary.blue}] group-hover:text-[${colors.primary.navy}] transition-colors`}>
              <span className="text-sm font-medium">
                {item.comingSoon ? 'Coming Soon' : 'Learn more'}
              </span>
              <ExternalLink className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
            </div>
          )}
        </div>
      </div>

      {/* Coming Soon Popup */}
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