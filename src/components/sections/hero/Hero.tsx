import React from 'react';
import HeroBackground from './HeroBackground';
import HeroContent from './HeroContent';
import HeroImageGrid from './HeroImageGrid';

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden">
      <HeroBackground />
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
          <HeroContent />
          <HeroImageGrid />
        </div>
      </div>
    </div>
  );
}