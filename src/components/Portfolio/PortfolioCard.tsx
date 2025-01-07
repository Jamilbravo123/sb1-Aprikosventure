import React from 'react';
import { ExternalLink, CircleDot } from 'lucide-react';
import { PortfolioItem } from './types';

interface PortfolioCardProps {
  item: PortfolioItem;
}

export default function PortfolioCard({ item }: PortfolioCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg">
      <div className="aspect-[16/9]">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold leading-6 text-gray-900">
            {item.title}
          </h3>
        </div>
        <span className={`inline-flex items-center gap-1 text-xs mb-2 ${
          item.status === 'active' ? 'text-green-600' : 'text-amber-600'
        }`}>
          <CircleDot className="h-3 w-3" />
          {item.status === 'active' ? 'Active' : 'Development'}
        </span>
        <p className="text-sm leading-6 text-gray-600">{item.description}</p>
        {item.link && (
          <div className="mt-3 flex items-center gap-2 text-purple-600">
            <span className="text-sm font-medium">Learn more</span>
            <ExternalLink className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}