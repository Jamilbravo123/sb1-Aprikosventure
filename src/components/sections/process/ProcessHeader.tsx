import React from 'react';
import { gradients } from '../../../constants/colors';

export default function ProcessHeader() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="inline-block">
        <h2 className={`text-3xl font-bold tracking-tight sm:text-4xl ${gradients.brand.primary} bg-clip-text text-transparent`}>
          How We Work
        </h2>
        <div className={`h-1 w-full ${gradients.background.primary} rounded-full mt-2`} />
      </div>
      <p className="mt-6 text-lg leading-8 text-slate-600">
        Our proven methodology transforms ideas into successful ventures through a systematic approach.
      </p>
    </div>
  );
}