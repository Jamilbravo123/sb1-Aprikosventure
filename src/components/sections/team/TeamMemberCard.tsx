import React from 'react';
import { Linkedin, Instagram, Mail } from 'lucide-react';
import type { TeamMember } from './types';
import { gradients } from '../../../constants/colors';

export default function TeamMemberCard({ name, role, image, bio, social }: TeamMember) {
  return (
    <div className="group relative">
      <div className="relative h-80 w-64 mx-auto overflow-hidden rounded-2xl bg-slate-900 shadow-lg transition-all duration-300 group-hover:shadow-xl">
        <img
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-95 ${
            (name === 'Sara Rana' || name === 'Robert Lyngmoe') ? 'object-top' : 'object-center'
          }`}
          src={image}
          alt={name}
          loading="eager"
        />
        <div className={`absolute inset-0 ${gradients.background.primary} opacity-0 transition-opacity duration-300 group-hover:opacity-75`} />
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-start p-6 transition-all duration-300 group-hover:bottom-20">
          <div className="flex items-center justify-between w-full">
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
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
                >
                  <Instagram className="h-4 w-4" />
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
          <p className="mt-4 text-sm text-slate-100 opacity-0 max-h-0 transition-all duration-300 group-hover:opacity-100 group-hover:max-h-40 overflow-hidden">
            {bio}
          </p>
        </div>
      </div>
    </div>
  );
}