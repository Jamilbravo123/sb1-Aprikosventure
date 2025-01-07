import React from 'react';
import { ExternalLink, CircleDot } from 'lucide-react';
import { PortfolioItem } from './types';
import { colors, gradients } from '../../../constants/colors';

interface PortfolioCardProps {
  item: PortfolioItem;
}

export default function PortfolioCard({ item }: PortfolioCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-xl font-semibold leading-6 text-slate-900 group-hover:text-[${colors.primary.blue}] transition-colors`}>
            {item.title}
          </h3>
        </div>
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full mb-3 transition-colors ${
          item.status === 'active' 
            ? 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100' 
            : 'bg-amber-50 text-amber-700 group-hover:bg-amber-100'
        }`}>
          <CircleDot className="h-3 w-3" />
          {item.status === 'active' ? 'Active' : 'Development'}
        </span>
        <p className="text-base leading-6 text-slate-600">{item.description}</p>
        {item.link && (
          <div className={`mt-4 flex items-center gap-2 text-[${colors.primary.blue}] group-hover:text-[${colors.primary.navy}] transition-colors`}>
            <span className="text-sm font-medium">Learn more</span>
            <ExternalLink className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
          </div>
        )}
      </div>
    </div>
  );
}