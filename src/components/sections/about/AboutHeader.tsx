import React from 'react';
import { gradients } from '../../../constants/colors';

export default function AboutHeader() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="inline-block">
        <h2 className={`text-3xl font-bold tracking-tight sm:text-4xl ${gradients.brand.primary} bg-clip-text text-transparent`}>
          About Us
        </h2>
        <div className={`h-1 w-full ${gradients.background.primary} rounded-full mt-2`} />
      </div>
      <p className="mt-6 text-lg leading-8 text-slate-600">
        We are a dynamic venture builder focused on transforming innovative ideas into successful companies. Through strategic investment and hands-on operational support, we help founders build market-leading businesses.
      </p>
    </div>
  );
}