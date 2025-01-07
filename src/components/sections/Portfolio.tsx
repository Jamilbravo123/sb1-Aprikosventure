import React from 'react';
import { ExternalLink, CircleDot } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';

interface PortfolioItem {
  title: string;
  description: string;
  image: string;
  status: 'active' | 'development';
  link?: string;
}

interface PortfolioCardProps {
  item: PortfolioItem;
}

function PortfolioCard({ item }: PortfolioCardProps) {
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

interface PortfolioSectionProps {
  title: string;
  items: PortfolioItem[];
}

function PortfolioSection({ title, items }: PortfolioSectionProps) {
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