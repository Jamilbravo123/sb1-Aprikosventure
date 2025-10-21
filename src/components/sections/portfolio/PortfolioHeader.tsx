import React from 'react';
import { gradients } from '../../../constants/colors';
import partnershipImage from '../../../assets/images/hero/Bilde_bent.jpg';

export default function PortfolioHeader() {
  return (
    <div className="lg:flex lg:items-center lg:gap-16 mb-16">
      {/* Text Content */}
      <div className="lg:w-1/2">
        <div className="mx-auto text-center lg:text-left max-w-2xl lg:mx-0">
          <div className="inline-block">
            <h2 className={`text-3xl font-bold tracking-tight sm:text-4xl ${gradients.brand.primary} bg-clip-text text-transparent`}>
              Our Portfolio
            </h2>
            <div className={`h-1 w-full ${gradients.background.primary} rounded-full mt-2`} />
          </div>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            From South Asia to Scandinavia, our ventures combine technology, strategy, and cross-border execution to build companies with real-world impact.
          </p>
        </div>
      </div>

      {/* Partnership Image */}
      <div className="mt-12 lg:mt-0 lg:w-1/2">
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl">
            <img
              src={partnershipImage}
              alt="Strategic partnerships driving global ventures"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-900/10" />
          <div className={`absolute -bottom-4 -right-4 h-72 w-72 ${gradients.background.primary} opacity-20 blur-3xl`} />
        </div>
        <p className="mt-4 text-sm text-slate-600 text-center lg:text-left italic">
          Pictured: Jamil Rehman and Bent Andreassen – Group Director at Pharma Nordic in connection with Pharmesa AS.
        </p>
      </div>
    </div>
  );
}