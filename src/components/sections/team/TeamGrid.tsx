import React from 'react';
import TeamMemberCard from './TeamMemberCard';
import { teamMembers } from './team.data';

export default function TeamGrid() {
  return (
    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
      {teamMembers.map((member, index) => (
        <div
          key={member.name}
          className="opacity-0 animate-fade-in"
          style={{ animationDelay: `${index * 0.15}s` }}
        >
          <TeamMemberCard {...member} />
        </div>
      ))}
    </div>
  );
}