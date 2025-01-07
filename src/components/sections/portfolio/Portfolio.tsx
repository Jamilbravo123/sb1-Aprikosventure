import React from 'react';
import PortfolioHeader from './PortfolioHeader';
import PortfolioCategories from './PortfolioCategories';

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <PortfolioHeader />
        <PortfolioCategories />
      </div>
    </section>
  );
}