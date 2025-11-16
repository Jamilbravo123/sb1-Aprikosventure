import React from 'react';
import NewsItem from './NewsItem';
import { news } from '../../data/news.mock';
import { INVESTOR_CLUB_COPY } from '../../constants/copy';

// Category mapping for news items
const NEWS_CATEGORIES: Record<string, string> = {
  '1': 'Listing',
  '2': 'BalderX',
  '3': 'Strategy',
  '4': 'Portfolio',
  '5': 'Framework',
};

export default function NewsList() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            {INVESTOR_CLUB_COPY.newsTitle}
          </h2>
          {/* Gold accent line with shimmer */}
          <div className="relative w-16 h-0.5 mx-auto mt-3 mb-6 overflow-hidden">
            <div className="absolute inset-0 bg-[#B8860B] opacity-90" />
            <div className="absolute inset-0 animate-shimmer" />
          </div>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {INVESTOR_CLUB_COPY.newsSubtitle}
          </p>
        </div>

        {/* Timeline - Single Column */}
        <div className="max-w-3xl mx-auto">
          {news.map((item, index) => (
            <div key={item.id}>
              <NewsItem 
                item={item} 
                category={NEWS_CATEGORIES[item.id] || 'Update'}
              />
              {/* Divider - except after last item */}
              {index < news.length - 1 && (
                <div className="border-b border-slate-700/50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

