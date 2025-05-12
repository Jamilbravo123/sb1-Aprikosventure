import React, { useState, useRef } from 'react';
import { ChevronDown, Heart, Code2 } from 'lucide-react';
import { portfolioData } from './data';
import PortfolioGrid from './PortfolioGrid';
import { CategoryKey } from './types';

const categoryIcons = {
  'Health Intelligence': <Heart className="w-6 h-6 text-rose-500" />,
  'Web3 & Software Innovation': <Code2 className="w-6 h-6 text-purple-500" />
};

const categorySubtext = {
  'Health Intelligence': 'AI-powered health solutions designed to empower patients, clinicians, and systems',
  'Web3 & Software Innovation': 'From tokens to code – building the backbone of future tech and finance'
};

export default function PortfolioCategories() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null);
  const categoryRefs = useRef<Record<CategoryKey, HTMLDivElement | null>>({
    'Health Intelligence': null,
    'Web3 & Software Innovation': null
  });

  const handleCategoryClick = (category: CategoryKey) => {
    if (activeCategory === category) {
      setActiveCategory(null);
      return;
    }

    if (activeCategory !== null) {
      setActiveCategory(null);
      setTimeout(() => {
        setActiveCategory(category);
        setTimeout(() => {
          const element = categoryRefs.current[category];
          if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 50);
      }, 300);
    } else {
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
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                {categoryIcons[category]}
                <h3 className="text-xl font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
                  {category}
                </h3>
              </div>
              <p className="text-sm text-slate-600 pl-9">{categorySubtext[category]}</p>
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