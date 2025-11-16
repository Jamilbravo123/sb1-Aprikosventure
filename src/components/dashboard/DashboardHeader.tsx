import { INVESTOR_CLUB_COPY } from '../../constants/copy';

export default function DashboardHeader() {
  return (
    <section className="pt-32 pb-24 relative overflow-hidden" style={{ 
      background: 'linear-gradient(135deg, #0A0E1A, #0F4C81, #1E2A4A, #0A0E1A)',
      backgroundSize: '200% 200%',
      animation: 'mesh-gradient 8s ease-in-out infinite'
    }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          {/* Main Title - Premium Split Design */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in">
            <span className="text-white tracking-wide whitespace-nowrap">Aprikos Venture </span>
            <span className="text-[#B8860B] font-medium tracking-wider uppercase whitespace-nowrap" style={{ fontFamily: "'Playfair Display', serif" }}>
              Private Lounge
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg leading-relaxed text-slate-300 max-w-3xl mx-auto">
            {INVESTOR_CLUB_COPY.subtitle}
          </p>
        </div>
      </div>
      
      {/* Smooth fade to dark background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 
        bg-gradient-to-b from-transparent to-[#0A0E1A] pointer-events-none z-10" />
    </section>
  );
}

