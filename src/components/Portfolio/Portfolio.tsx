import React from 'react';
import PortfolioSection from './PortfolioSection';
import { portfolioData } from './data';

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Portfolio</h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Discover our diverse portfolio of innovative ventures across multiple industries.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(portfolioData).map(([category, items]) => (
            <PortfolioSection key={category} title={category} items={items} />
          ))}
        </div>
      </div>
    </section>
  );
}