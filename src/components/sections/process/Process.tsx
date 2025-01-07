import React from 'react';
import ProcessHeader from './ProcessHeader';
import ProcessGrid from './ProcessGrid';

export default function Process() {
  return (
    <section id="process" className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ProcessHeader />
        <ProcessGrid />
      </div>
    </section>
  );
}