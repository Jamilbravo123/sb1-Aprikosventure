import React from 'react';
import { PortfolioItem } from './types';
import PortfolioCard from './PortfolioCard';

interface PortfolioSectionProps {
  title: string;
  items: PortfolioItem[];
}

export default function PortfolioSection({ title, items }: PortfolioSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <PortfolioCard key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
}