import React from 'react';
import { ExternalLink } from 'lucide-react';
import { PortfolioCardProps } from '../types';
import StatusBadge from './StatusBadge';
import CompanyTags from './CompanyTags';

export default function PortfolioCard({ company }: PortfolioCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="aspect-[16/9] overflow-hidden h-36 sm:h-44">
        <img
          src={company.image}
          alt={company.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base sm:text-lg font-semibold leading-6 text-slate-900 group-hover:text-[#0F4C81] transition-colors">
            {company.name}
          </h3>
        </div>
        <StatusBadge status={company.status} />
        <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-2 text-xs sm:text-sm">
          {company.description}
        </p>
        <CompanyTags tags={company.tags} />
        {company.link && (
          <div className="mt-3 flex items-center gap-2 text-[#0F4C81] group-hover:text-[#1E2A4A] transition-colors">
            <span className="text-xs sm:text-sm font-medium">Learn more</span>
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 transform transition-transform group-hover:translate-x-1" />
          </div>
        )}
      </div>
    </div>
  );
}