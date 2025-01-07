import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { portfolioData } from './data';
import PortfolioGrid from './PortfolioGrid';
import { CategoryKey } from './types';

export default function PortfolioCategories() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null);

  return (
    <div className="mt-16 space-y-4">
      {(Object.keys(portfolioData) as CategoryKey[]).map((category) => (
        <div key={category} className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <button
            onClick={() => setActiveCategory(activeCategory === category ? null : category)}
            className="flex w-full items-center justify-between bg-slate-50 px-6 py-4 text-left transition-colors hover:bg-slate-100"
          >
            <h3 className="text-xl font-semibold text-slate-900">{category}</h3>
            <ChevronDown
              className={`h-5 w-5 text-slate-500 transition-transform duration-200 ${
                activeCategory === category ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`grid transition-all duration-200 ease-in-out ${
              activeCategory === category
                ? 'grid-rows-[1fr] opacity-100'
                : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="p-6">
                <PortfolioGrid items={portfolioData[category]} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}