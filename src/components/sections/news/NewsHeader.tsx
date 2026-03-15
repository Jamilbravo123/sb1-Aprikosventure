export default function NewsHeader() {
  return (
    <div className="text-center mb-16">
      <p className="text-sm uppercase tracking-[0.25em] text-[#C9935E] mb-4">Updates</p>
      <div className="inline-block">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-white">
          News & Milestones
        </h2>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#C9935E] to-transparent rounded-full mt-3" />
      </div>
      <p className="mt-6 text-lg leading-8 text-slate-400 max-w-2xl mx-auto">
        News, milestones, and updates from across the Aprikos Venture ecosystem.
      </p>
    </div>
  );
}
