import { Linkedin, Instagram, Mail } from 'lucide-react';
import type { TeamMember } from './types';

export default function TeamMemberCard({ name, role, image, bio, shortBio, social }: TeamMember) {
  return (
    <div className="group relative">
      <div className="relative h-80 w-64 mx-auto overflow-hidden rounded-2xl bg-slate-900 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#C9935E]/5">
        <img
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-95 ${
            (name === 'Sara Rana' || name === 'Robert Lyngmoe') ? 'object-top' : 'object-center'
          }`}
          src={image}
          alt={name}
          loading="lazy"
        />
        {/* Copper-toned overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/60 to-[#C9935E]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-90" />

        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-start p-4 sm:p-6 bg-gradient-to-t from-[#0c0c0c]/90 via-[#0c0c0c]/40 to-transparent">
          <div className="flex items-center justify-between w-full">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white">{name}</h3>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-300">{role}</p>
            </div>
            <div className="flex gap-2">
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} on LinkedIn`}
                  className="rounded-full bg-white/10 p-2 text-white hover:bg-[#C9935E]/20 hover:text-[#C9935E] transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} on Instagram`}
                  className="rounded-full bg-white/10 p-2 text-white hover:bg-[#C9935E]/20 hover:text-[#C9935E] transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {social.email && (
                <a
                  href={`mailto:${social.email}`}
                  aria-label={`Email ${name}`}
                  className="rounded-full bg-white/10 p-2 text-white hover:bg-[#C9935E]/20 hover:text-[#C9935E] transition-colors"
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
          {shortBio && (
            <p className="mt-3 text-sm text-[#E8C896] opacity-0 max-h-0 transition-all duration-300 group-hover:opacity-100 group-hover:max-h-20 overflow-hidden">
              {shortBio}
            </p>
          )}
          <p className="mt-2 text-sm text-slate-200 opacity-0 max-h-0 transition-all duration-300 group-hover:opacity-100 group-hover:max-h-40 overflow-hidden">
            {bio}
          </p>
        </div>
      </div>
    </div>
  );
}
