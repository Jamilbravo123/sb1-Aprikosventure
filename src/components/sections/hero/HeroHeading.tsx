import React from 'react';
import { gradients } from '../../../constants/colors';

export default function HeroHeading() {
  return (
    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
      Turning ideas into{' '}
      <span className={`${gradients.brand.primary} bg-clip-text text-transparent`}>
        impactful ventures
      </span>
    </h1>
  );
}