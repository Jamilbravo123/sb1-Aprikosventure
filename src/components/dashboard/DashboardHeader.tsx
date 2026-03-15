export default function DashboardHeader() {
  return (
    <section className="pt-32 pb-16 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#0A0E1A] to-transparent" />
      
      <div className="relative mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Our </span>
            <span className="text-[#B8860B]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Venture Structure
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-slate-300 mb-3">
            Building and scaling ventures across borders
          </p>
          
          {/* Supporting line */}
          <p className="text-sm text-slate-500">
            Explore our portfolio of companies and strategic holdings
          </p>
        </div>
      </div>
    </section>
  );
}
