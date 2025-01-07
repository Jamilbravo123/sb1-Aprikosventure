import React from 'react';
import { gradients } from '../../../../constants/colors';

export default function PortfolioHeader() {
  return (
    <div className="mx-auto max-w-3xl text-center mb-8 sm:mb-16 px-4 sm:px-0">
      <div className="inline-block">
        <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl ${gradients.brand.primary} bg-clip-text text-transparent`}>
          Our Portfolio
        </h2>
        <div className={`h-1 w-full ${gradients.background.primary} rounded-full mt-2`} />
      </div>
      <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-slate-600">
        Our portfolio features ventures meant to drive innovation, resilience, and impact. Built in-house or with visionary founders, they aim to reshape industries and deliver lasting value.
      </p>
    </div>
  );
}