import React from 'react';
import { Target, Lightbulb, Users } from 'lucide-react';
import ValueCard from './ValueCard';

const values = [
  {
    icon: Target,
    title: 'Strategic Vision',
    description: 'We identify and nurture transformative ideas that shape the future of technology and business.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation First',
    description: 'Our focus on blockchain and AI drives breakthrough solutions across all industries.',
  },
  {
    icon: Users,
    title: 'Strong Partnerships',
    description: 'We build lasting relationships with founders, creating value through collaborative growth.',
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">About Us</h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            We're a venture studio that transforms innovative ideas into successful companies through strategic investment and hands-on operational support.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {values.map((value) => (
            <ValueCard key={value.title} {...value} />
          ))}
        </div>
      </div>
    </section>
  );
}