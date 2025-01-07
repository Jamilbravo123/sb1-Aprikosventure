import React from 'react';
import ProcessStep from './ProcessStep';
import { processSteps } from './process.data';

export default function ProcessGrid() {
  return (
    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-none lg:grid-cols-4">
      {processSteps.map((step, index) => (
        <ProcessStep 
          key={step.title} 
          {...step} 
          isLast={index === processSteps.length - 1} 
        />
      ))}
    </div>
  );
}