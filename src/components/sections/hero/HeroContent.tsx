import React from 'react';
import HeroHeading from './HeroHeading';

export default function HeroContent() {
  return (
    <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
      <HeroHeading />
      <p className="relative mt-6 text-lg leading-8 text-slate-600 sm:max-w-md lg:max-w-none">
        Empowering entrepreneurs to create transformative tech ventures with strategic expertise and a passion for innovation
      </p>
      <div className="mt-8 flex items-center gap-x-6">
        <a href="#portfolio" className="text-sm font-semibold leading-6 text-slate-900 hover:text-[#0F4C81] transition-colors">
          View Portfolio <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}