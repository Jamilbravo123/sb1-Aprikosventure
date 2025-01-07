import React from 'react';
import ValueCard from './ValueCard';
import { values } from './values.data';

export default function ValuesGrid() {
  return (
    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-none lg:grid-cols-4">
      {values.map((value, index) => (
        <div
          key={value.title}
          className="opacity-0 animate-fade-in"
          style={{ animationDelay: `${index * 0.15}s` }}
        >
          <ValueCard {...value} />
        </div>
      ))}
    </div>
  );
}