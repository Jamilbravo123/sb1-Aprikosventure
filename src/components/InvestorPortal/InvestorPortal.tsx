import React from 'react';
import { Lock } from 'lucide-react';

export default function InvestorPortal() {
  return (
    <section id="investor" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center mb-6">
            <Lock className="h-12 w-12 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Investor Portal
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Our secure investor portal is coming soon. Stay tuned for exclusive access to portfolio performance, investment opportunities, and detailed reports.
          </p>
          <button className="mt-8 rounded-full bg-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 cursor-not-allowed">
            Coming Soon
          </button>
        </div>
      </div>
    </section>
  );
}