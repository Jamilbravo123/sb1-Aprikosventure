import React from 'react';
import { PortfolioSectionProps } from '../types';
import PortfolioCard from './PortfolioCard';

export default function PortfolioSection({ title, companies }: PortfolioSectionProps) {
  return (
    <div className="space-y-6 opacity-0 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-start">
          <span className="bg-white pr-6 text-xl font-semibold text-slate-900">
            {title}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company, index) => (
          <div
            key={company.id}
            className="opacity-0 animate-fade-in"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <PortfolioCard company={company} />
          </div>
        ))}
      </div>
    </div>
  );
}