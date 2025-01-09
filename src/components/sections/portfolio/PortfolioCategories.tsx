import React, { useState, useRef } from 'react';
import { ChevronDown, Cpu, Link2 } from 'lucide-react';
import { portfolioData } from './data';
import PortfolioGrid from './PortfolioGrid';
import { CategoryKey } from './types';

const categoryIcons = {
  'Artificial Intelligence': <Cpu className="w-6 h-6 text-blue-500" />,
  'Distributed Ledger Technology': <Link2 className="w-6 h-6 text-purple-500" />
};

export default function PortfolioCategories() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null);
  const categoryRefs = useRef<Record<CategoryKey, HTMLDivElement | null>>({
    'Artificial Intelligence': null,
    'Distributed Ledger Technology': null
  });

  const handleCategoryClick = (category: CategoryKey) => {
    // If clicking the same category, just close it
    if (activeCategory === category) {
      setActiveCategory(null);
      return;
    }

    // If a different category is already open, close it first
    if (activeCategory !== null) {
      setActiveCategory(null);
      // Wait for the closing animation
      setTimeout(() => {
        setActiveCategory(category);
        // Then scroll to the new category
        setTimeout(() => {
          const element = categoryRefs.current[category];
          if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 50);
      }, 300); // Wait for closing animation to complete
    } else {
      // If no category is open, just open the new one
      setActiveCategory(category);
      setTimeout(() => {
        const element = categoryRefs.current[category];
        if (element) {
          const yOffset = -100;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 50);
    }
  };

  return (
    <div className="mt-16 space-y-4">
      {(Object.keys(portfolioData) as CategoryKey[]).map((category) => (
        <div 
          key={category} 
          className="overflow-hidden rounded-2xl bg-white shadow-sm"
          ref={el => categoryRefs.current[category] = el}
        >
          <button
            onClick={() => handleCategoryClick(category)}
            className="group flex w-full items-center justify-between bg-slate-50 px-6 py-4 text-left 
              transition-all duration-300 hover:bg-slate-100 
              hover:shadow-md active:shadow-sm
              transform hover:-translate-y-[1px] active:translate-y-0"
          >
            <div className="flex items-center gap-3">
              {categoryIcons[category]}
              <h3 className="text-xl font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
                {category}
              </h3>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-slate-500 transition-all duration-300 
                group-hover:text-blue-600
                ${activeCategory === category ? 'rotate-180 transform' : 'transform'}
                group-hover:scale-110`}
            />
          </button>
          <div
            className={`grid transition-all duration-300 ease-in-out 
              ${activeCategory === category
                ? 'grid-rows-[1fr] opacity-100 transform translate-y-0'
                : 'grid-rows-[0fr] opacity-0 transform -translate-y-2'
              }`}
          >
            <div className="overflow-hidden">
              <div className="p-6">
                <PortfolioGrid 
                  items={portfolioData[category]} 
                  isActive={activeCategory === category}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}