import React from 'react';
import { ArrowRight } from 'lucide-react';
import { gradients } from '../../../constants/colors';
import HeroHeading from './HeroHeading';

export default function HeroContent() {
  return (
    <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
      <HeroHeading />
      <p className="relative mt-6 text-lg leading-8 text-slate-600 sm:max-w-md lg:max-w-none">
        Empowering entrepreneurs to build innovative businesses that shape the future. We combine strategic insight, operational expertise, and a passion for transformation.
      </p>
      <div className="mt-8 flex items-center gap-x-6">
        <a
          href="#contact"
          className={`rounded-full ${gradients.background.primary} px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4C81] transition-opacity flex items-center gap-2`}
        >
          Become a Owner <ArrowRight className="w-4 h-4" />
        </a>
        <a href="#portfolio" className="text-sm font-semibold leading-6 text-slate-900 hover:text-[#0F4C81] transition-colors">
          View Portfolio <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}