import React from 'react';
import { Key, ExternalLink } from 'lucide-react';
import { INVESTOR_CLUB_COPY } from '../../constants/copy';

export default function MembershipStatus() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 
          bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl 
          shadow-2xl hover:bg-white/10 transition-all">
          
          <div className="flex items-start gap-4 flex-1">
            <div className="flex-shrink-0 w-12 h-12 bg-[#B8860B]/20 rounded-xl flex items-center justify-center 
              border border-[#B8860B]/30">
              <Key className="w-6 h-6 text-[#B8860B]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Membership Requirement
              </h3>
              <p className="text-slate-300 mb-2 leading-relaxed">
                {INVESTOR_CLUB_COPY.membershipRequirement}
              </p>
              <p className="text-sm text-slate-400">
                {INVESTOR_CLUB_COPY.verificationNote}
              </p>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <a
              href="https://venturetoken.io/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Learn more about Venturetoken"
              className="inline-flex items-center gap-2 px-6 py-3 
                border-2 border-[#B8860B] text-[#B8860B] rounded-lg font-medium 
                hover:bg-[#B8860B] hover:text-white transition-all shadow-md hover:shadow-lg"
            >
              Learn more about Venturetoken
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

