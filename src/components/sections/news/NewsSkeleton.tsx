export default function NewsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-[#141420]/50 border border-slate-700/30 p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 w-16 rounded-full skeleton-shimmer" />
            <div className="h-4 w-20 rounded skeleton-shimmer" />
          </div>
          <div className="h-6 w-3/4 rounded skeleton-shimmer" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded skeleton-shimmer" />
            <div className="h-4 w-5/6 rounded skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
