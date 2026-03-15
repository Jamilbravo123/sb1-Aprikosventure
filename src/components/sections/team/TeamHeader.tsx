export default function TeamHeader() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm uppercase tracking-[0.25em] text-[#C9935E] mb-4">Our Team</p>
      <div className="inline-block">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-white">
          The People Behind the Ventures
        </h2>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#C9935E] to-transparent rounded-full mt-3" />
      </div>
      <p className="mt-6 text-lg leading-7 text-slate-400">
        Meet the dedicated team driving innovation and fostering growth at Aprikos Venture.
      </p>
    </div>
  );
}
