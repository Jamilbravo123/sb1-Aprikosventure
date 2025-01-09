import React from 'react';
import PortfolioCard from './PortfolioCard';
import { PortfolioItem } from './types';

interface PortfolioGridProps {
  items: PortfolioItem[];
  isActive?: boolean;
}

export default function PortfolioGrid({ items, isActive = false }: PortfolioGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {items.map((item, index) => (
        <div key={index} className="flex">
          <PortfolioCard item={item} isActive={isActive} />
        </div>
      ))}
    </div>
  );
}