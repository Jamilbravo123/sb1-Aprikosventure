import React from 'react';
import { gradients } from '../../../constants/colors';
import { useInView } from '../../../hooks/useInView';

export default function ProcessHeader() {
  const [ref, isInView] = useInView();

  return (
    <div ref={ref} className="mx-auto max-w-2xl text-center">
      <div className={`inline-block opacity-0 ${isInView ? 'animate-scale-up' : ''}`}>
        <h2 className={`text-3xl font-bold tracking-tight sm:text-4xl ${gradients.brand.primary} bg-clip-text text-transparent`}>
          How We Work
        </h2>
        <div 
          className={`h-1 w-full ${gradients.background.primary} rounded-full mt-2 opacity-0 ${isInView ? 'animate-slide-in' : ''}`} 
          style={{ animationDelay: isInView ? '0.2s' : undefined }}
        />
      </div>
      <p 
        className={`mt-6 text-lg leading-8 text-slate-600 opacity-0 ${isInView ? 'animate-slide-up' : ''}`}
        style={{ animationDelay: isInView ? '0.3s' : undefined }}
      >
        Our proven methodology transforms ideas into successful ventures through a systematic approach.
      </p>
    </div>
  );
}