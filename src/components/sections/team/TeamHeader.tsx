import React from 'react';
import { gradients } from '../../../constants/colors';

export default function TeamHeader() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="inline-block">
        <h2 className={`text-3xl font-bold tracking-tight sm:text-4xl ${gradients.brand.primary} bg-clip-text text-transparent`}>
          Our Core Team
        </h2>
        <div className={`h-1 w-full ${gradients.background.primary} rounded-full mt-2`} />
      </div>
      <p className="mt-6 text-lg leading-7 text-slate-600">
        Aprikos Venture stands at the forefront of entrepreneurship and innovation as a dynamic venture studio. We empower progress by cultivating groundbreaking ideas and transformative technologies. Meet the dedicated team driving innovation and fostering growth at Aprikos Venture.
      </p>
    </div>
  );
}