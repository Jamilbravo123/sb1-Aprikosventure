import React from 'react';
import { Blocks, Brain, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="lg:w-1/2">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
              Building Tomorrow's
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"> Innovation </span>
              Today
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Aprikos Venture AS is a forward-thinking venture studio, partnering with visionary founders to build groundbreaking companies at the intersection of blockchain, AI, and beyond.
            </p>
            <div className="mt-10 flex items-center gap-6">
              <button className="rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 flex items-center gap-2">
                Get in touch <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 rounded-3xl opacity-30 blur-3xl"></div>
            <div className="relative grid grid-cols-2 gap-6">
              <div className="flex items-center justify-center bg-white p-8 rounded-2xl shadow-lg">
                <Blocks className="w-16 h-16 text-purple-600" />
              </div>
              <div className="flex items-center justify-center bg-white p-8 rounded-2xl shadow-lg mt-12">
                <Brain className="w-16 h-16 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}