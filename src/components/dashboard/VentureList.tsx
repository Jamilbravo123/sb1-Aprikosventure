import React from 'react';
import VentureCard from './VentureCard';
import { ventures } from '../../data/ventures.mock';
import { INVESTOR_CLUB_COPY } from '../../constants/copy';

export default function VentureList() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            {INVESTOR_CLUB_COPY.opportunitiesTitle}
          </h2>
          {/* Gold accent line with shimmer */}
          <div className="relative w-16 h-0.5 mx-auto mt-3 mb-6 overflow-hidden">
            <div className="absolute inset-0 bg-[#B8860B] opacity-90" />
            <div className="absolute inset-0 animate-shimmer" />
          </div>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {INVESTOR_CLUB_COPY.opportunitiesIntro}
          </p>
        </div>

        {/* Venture Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ventures.map((venture, index) => (
            <div key={venture.id} style={{ animationDelay: `${index * 0.5}s` }}>
              <VentureCard venture={venture} />
            </div>
          ))}
        </div>

        {/* Legal Disclaimer - Below Cards */}
        <div className="mt-12 max-w-4xl mx-auto">
          <p className="text-xs text-slate-400 text-center leading-relaxed bg-slate-900/30 p-6 rounded-xl border border-slate-700/30">
            {INVESTOR_CLUB_COPY.opportunitiesDisclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}

