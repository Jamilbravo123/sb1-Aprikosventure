import { useState } from 'react';
import VentureCard from './VentureCard';
import { getTopLevelVentures } from '../../data/ventures.mock';
import type { Industry } from '../../types/dashboard';

type FilterType = 'ALL' | Industry;

export default function VentureList() {
  const [filter, setFilter] = useState<FilterType>('ALL');
  
  const allVentures = getTopLevelVentures();
  
  // Filter by industry (include all ventures in main grid)
  const filteredVentures = filter === 'ALL' 
    ? allVentures 
    : allVentures.filter(v => v.industry === filter);

  // Get unique industries from ventures
  const industries: FilterType[] = ['ALL', 'fintech', 'healthtech', 'web3', 'industry', 'software'];

  const industryLabels: Record<FilterType, string> = {
    'ALL': 'All',
    'fintech': 'Fintech',
    'healthtech': 'Healthtech',
    'web3': 'Web3',
    'industry': 'Industry',
    'maritime': 'Maritime',
    'proptech': 'Proptech',
    'medtech': 'Medtech',
    'software': 'Software',
  };

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Industry Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setFilter(ind)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === ind 
                  ? 'bg-[#B8860B] text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {industryLabels[ind]}
            </button>
          ))}
        </div>

        {/* Venture Cards Grid - 3 columns for balanced layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVentures.map((venture) => (
            <VentureCard key={venture.id} venture={venture} />
          ))}
        </div>

        {/* Empty State */}
        {filteredVentures.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No ventures found for this filter.</p>
          </div>
        )}
      </div>
    </section>
  );
}
