import React from 'react';
import { gradients } from '../../../constants/colors';

export default function PortfolioHeader() {
  return (
    <div className="mx-auto max-w-3xl text-center mb-16">
      <div className="inline-block">
        <h2 className={`text-3xl font-bold tracking-tight sm:text-4xl ${gradients.brand.primary} bg-clip-text text-transparent`}>
          Our Portfolio
        </h2>
        <div className={`h-1 w-full ${gradients.background.primary} rounded-full mt-2`} />
      </div>
      <p className="mt-6 text-lg leading-8 text-slate-600">
        Our portfolio features tech-based ventures meant to drive innovation, resilience, and impact. Built in-house or with visionary founders, they aim to reshape industries and deliver lasting value.
      </p>
    </div>
  );
}