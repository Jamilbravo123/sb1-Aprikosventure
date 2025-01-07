import React from 'react';
import { Linkedin, Twitter, Mail } from 'lucide-react';
import type { TeamMember } from './types';
import { gradients } from '../../../constants/colors';

export default function TeamMemberCard({ name, role, image, bio, social }: TeamMember) {
  return (
    <div className="group relative">
      <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 group-hover:shadow-xl">
        <img
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={image}
          alt={name}
        />
        <div className={`absolute inset-0 ${gradients.background.primary} opacity-0 transition-opacity duration-300 group-hover:opacity-75`} />
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 transition-transform duration-300 group-hover:translate-y-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">{name}</h3>
              <p className="mt-1 text-sm text-slate-200">{role}</p>
            </div>
            <div className="flex gap-2">
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {social.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {social.email && (
                <a
                  href={`mailto:${social.email}`}
                  className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {bio}
          </p>
        </div>
      </div>
    </div>
  );
}