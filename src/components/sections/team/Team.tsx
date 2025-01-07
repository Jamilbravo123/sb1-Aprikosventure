import React from 'react';
import TeamHeader from './TeamHeader';
import TeamGrid from './TeamGrid';

export default function Team() {
  return (
    <section id="team" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <TeamHeader />
        <TeamGrid />
      </div>
    </section>
  );
}