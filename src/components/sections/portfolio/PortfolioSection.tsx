import React from 'react';
import { PortfolioItem } from './types';
import PortfolioCard from './PortfolioCard';

interface PortfolioSectionProps {
  title: string;
  items: PortfolioItem[];
}

export default function PortfolioSection({ title, items }: PortfolioSectionProps) {
  return (
    <div className="space-y-8 opacity-0 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-start">
          <span className="bg-white pr-6 text-2xl font-semibold text-slate-900">
            {title}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {items.map((item, index) => (
          <div
            key={item.title}
            className="opacity-0 animate-fade-in"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <PortfolioCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}