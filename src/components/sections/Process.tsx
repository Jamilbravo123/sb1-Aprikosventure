import React from 'react';
import ProcessStep from './process/ProcessStep';
import { Search, Lightbulb, Rocket, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Discovery',
    description: 'We identify promising opportunities and validate market potential.',
    number: '01',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Developing unique solutions through technology and creativity.',
    number: '02',
  },
  {
    icon: Rocket,
    title: 'Launch',
    description: 'Rapid deployment with continuous testing and refinement.',
    number: '03',
  },
  {
    icon: TrendingUp,
    title: 'Scale',
    description: 'Growing ventures through strategic partnerships and market expansion.',
    number: '04',
  },
];

export default function Process() {
  return (
    <section id="process" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How We Work</h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Our proven methodology transforms ideas into successful ventures through a systematic approach.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-none lg:grid-cols-4">
          {steps.map((step, index) => (
            <ProcessStep key={step.title} {...step} isLast={index === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}