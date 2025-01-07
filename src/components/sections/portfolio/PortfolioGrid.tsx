import React from 'react';
import PortfolioCard from './PortfolioCard';
import { PortfolioItem } from './types';

interface PortfolioGridProps {
  items: PortfolioItem[];
}

export default function PortfolioGrid({ items }: PortfolioGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
  );
}