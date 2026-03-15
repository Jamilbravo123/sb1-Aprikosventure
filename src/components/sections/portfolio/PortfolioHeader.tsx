export default function PortfolioHeader() {
  return (
    <div className="text-center mb-16">
      <span className="text-[#C9935E] text-xs font-medium tracking-[0.2em] uppercase mb-3 block">
        Our Ecosystem
      </span>
      <div className="inline-block">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-white text-balance">
          Ventures We Build
        </h2>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold to-transparent rounded-full mt-3" />
      </div>
      <p className="mt-6 text-lg leading-8 text-slate-400 max-w-2xl mx-auto text-pretty">
        Building and investing across two core verticals where technology meets opportunity.
      </p>
    </div>
  );
}
