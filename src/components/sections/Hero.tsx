import React from 'react';
import { ArrowRight } from 'lucide-react';
import { gradients } from '../../constants/colors';

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div 
          className={`relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] ${gradients.background.primary} opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]`} 
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
          <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Turning Ideas into{' '}
              <span className={`${gradients.brand.primary} bg-clip-text text-transparent`}>
                Impactful Ventures
              </span>
            </h1>
            <p className="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
              Empowering entrepreneurs to build innovative businesses that shape the future. We combine strategic insight, operational expertise, and a passion for transformation.
            </p>
            <div className="mt-8 flex items-center gap-x-6">
              <a
                href="#portfolio"
                className="rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 flex items-center gap-2"
              >
                Explore Our Work <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#contact" className="text-sm font-semibold leading-6 text-gray-900 hover:text-purple-600 transition-colors">
                Contact Us <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Image grid */}
          <div className="mt-14 flex justify-end gap-8 sm:-mt-24 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
            <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1485217988980-11786ced9454?ixlib=rb-4.0.3&auto=format&fit=crop&h=528&q=80"
                  alt="Team collaboration"
                  className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
              </div>
            </div>
            <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&h=528&q=80"
                  alt="Business meeting"
                  className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&h=528&q=80"
                  alt="Innovation workspace"
                  className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}