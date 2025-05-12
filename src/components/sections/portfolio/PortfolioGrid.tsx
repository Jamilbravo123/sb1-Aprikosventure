import React from 'react';
import PortfolioCard from './PortfolioCard';
import { PortfolioItem } from './types';

interface PortfolioGridProps {
  items: PortfolioItem[];
  isActive?: boolean;
}

export default function PortfolioGrid({ items, isActive = false }: PortfolioGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {items.map((item, index) => (
        <div key={index} className="flex">
          <PortfolioCard item={item} isActive={isActive} />
        </div>
      ))}
    </div>
  );
}