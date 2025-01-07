import React from 'react';
import PortfolioCard from './PortfolioCard';
import { companies } from '../data/companies';

export default function PortfolioGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-0">
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
  );
}