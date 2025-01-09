import React from 'react';
import { gradients } from '../../../constants/colors';
import brochurePicture from '../../../assets/images/hero/brochure-picture.webp';

export default function About() {
  return (
    <section id="about" className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:gap-16">
          {/* Content */}
          <div className="lg:w-1/2">
            <div className="mx-auto text-center lg:text-left max-w-2xl lg:mx-0">
              <div className="inline-block">
                <h2 className={`text-3xl font-bold tracking-tight sm:text-4xl ${gradients.brand.primary} bg-clip-text text-transparent`}>
                  About Us
                </h2>
                <div className={`h-1 w-full ${gradients.background.primary} rounded-full mt-2`} />
              </div>
              <div className="mt-6 space-y-4 text-lg leading-8 text-slate-600">
                <p>
                  We are a dynamic venture builder focused on transforming innovative ideas into successful companies. Through strategic investment and hands-on operational support, we help founders build market-leading businesses.
                </p>
                <p>
                  Our approach combines deep industry expertise with cutting-edge technology insights, enabling us to identify and nurture transformative opportunities across multiple sectors. We work closely with founders to provide not just capital, but the strategic guidance and operational support needed to scale effectively.
                </p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="mt-12 lg:mt-0 lg:w-1/2">
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                <img
                  src={brochurePicture}
                  alt="Aprikos Venture Brochure"
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-900/10" />
              <div className={`absolute -bottom-4 -right-4 h-72 w-72 ${gradients.background.primary} opacity-20 blur-3xl`} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}