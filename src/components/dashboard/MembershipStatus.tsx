import { Key } from 'lucide-react';

export default function MembershipStatus() {
  return (
    <section className="py-12 pb-20">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="flex items-center gap-4 p-5 rounded-xl bg-slate-800/30 border border-slate-700/30">
          <div className="flex-shrink-0 w-10 h-10 bg-[#B8860B]/10 rounded-lg flex items-center justify-center">
            <Key className="w-5 h-5 text-[#B8860B]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-300">
              <span className="font-medium text-white">Membership requirement:</span>{' '}
              Access requires holding 100 Venturetoken (Vt).{' '}
              <a 
                href="https://venturetoken.io/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#B8860B] hover:text-[#D4A84B] transition-colors"
              >
                Learn more →
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
