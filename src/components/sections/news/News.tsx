import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../../lib/gsap';
import { ExternalLink } from 'lucide-react';
import { useNews } from '../../../hooks/useNews';
import NewsHeader from './NewsHeader';
import NewsSkeleton from './NewsSkeleton';
import type { NewsItem } from '../../../types/news';
import { categoryLabels, categoryColors } from '../../../types/news';

// Map news titles to venture names for the feed
const ventureFromTitle: Record<string, string> = {
  ShippingX: 'ShippingX',
  Mashwara: 'Mashwara AI',
  NBX: 'Nayapaisa',
  Kinetic: 'Kinetic Energy',
  'Aprikos Medical': 'Aprikos Medical',
};

function getVentureName(title: string): string | null {
  for (const [key, name] of Object.entries(ventureFromTitle)) {
    if (title.includes(key)) return name;
  }
  return null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function SourceLink({ url }: { url?: string }) {
  if (!url || !url.includes('newsweb')) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-gold/60 hover:text-gold text-xs font-medium transition-colors"
    >
      Source <ExternalLink className="w-3 h-3" />
    </a>
  );
}

function FeaturedCard({ item }: { item: NewsItem }) {
  const venture = getVentureName(item.title);
  return (
    <article className="news-card group relative rounded-2xl border border-white/[0.06] p-10 lg:p-12 transition-all duration-500 hover:border-gold/20 hover:-translate-y-1 hover:shadow-[0_12px_48px_rgba(201,147,94,0.08)] overflow-hidden featured-pulse">
      {/* Subtle radial glow behind */}
      <div className="absolute inset-0 rounded-2xl" style={{
        background: 'radial-gradient(ellipse at 30% 50%, rgba(201,147,94,0.04) 0%, transparent 70%)',
      }} />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          {venture && <span className="text-gold text-[11px] font-semibold tracking-wider uppercase">{venture}</span>}
          {venture && <span className="text-[#333]">·</span>}
          <time className="text-xs text-[#555]">{formatDate(item.published_at)}</time>
        </div>
        <h3 className="font-display text-2xl lg:text-[32px] font-bold text-white mb-5 group-hover:text-gold-light transition-colors leading-tight shimmer-text">
          {item.title}
        </h3>
        <p className="text-[16px] text-[#888] leading-[1.8] mb-5 max-w-[700px]">
          {item.summary}
        </p>
        <SourceLink url={item.url} />
      </div>
    </article>
  );
}

function SecondaryCard({ item }: { item: NewsItem }) {
  const venture = getVentureName(item.title);
  return (
    <article className="news-card group rounded-xl bg-[#141420]/30 border border-white/[0.04] p-7 transition-all duration-400 hover:border-gold/15 hover:bg-[#141420]/50 hover:-translate-y-1">
      <div className="flex items-center gap-2 mb-4">
        {venture && <span className="text-gold text-[10px] font-semibold tracking-wider uppercase">{venture}</span>}
        {venture && <span className="text-[#333]">·</span>}
        <time className="text-[11px] text-[#555]">{formatDate(item.published_at)}</time>
      </div>
      <h3 className="text-[18px] font-semibold text-white mb-3 group-hover:text-gold-light transition-colors leading-snug">
        {item.title}
      </h3>
      <p className="text-[14px] text-[#777] leading-[1.7]">
        {item.summary}
      </p>
      <div className="mt-4">
        <SourceLink url={item.url} />
      </div>
    </article>
  );
}

function CompactItem({ item }: { item: NewsItem }) {
  const venture = getVentureName(item.title);
  return (
    <article className="news-card group flex items-start gap-5 py-5 border-b border-white/[0.04] last:border-b-0 transition-all duration-300 hover:bg-white/[0.01] hover:px-3 hover:-mx-3 rounded-lg">
      {/* Timeline dot + date */}
      <div className="flex flex-col items-center flex-shrink-0 w-[85px] pt-1">
        <time className="text-[11px] text-[#555] whitespace-nowrap">
          {formatDate(item.published_at)}
        </time>
      </div>

      {/* Vertical line */}
      <div className="w-px self-stretch bg-gradient-to-b from-gold/20 via-gold/10 to-transparent flex-shrink-0 relative">
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold/40" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-1">
        <div className="flex items-center gap-2 mb-1.5">
          {venture && <span className="text-gold text-[10px] font-semibold tracking-wider uppercase">{venture}</span>}
        </div>
        <h4 className="text-[15px] font-semibold text-white group-hover:text-gold-light transition-colors leading-snug">
          {item.title}
        </h4>
        <p className="text-[12px] text-[#666] leading-relaxed mt-1.5">
          {item.summary}
        </p>
      </div>
    </article>
  );
}

export default function News() {
  const { news, loading, error } = useNews(6);
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || loading) return;

    const cards = sectionRef.current.querySelectorAll('.news-card');
    gsap.set(cards, { y: 20, opacity: 0 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        });
      },
    });
  }, { scope: sectionRef, dependencies: [loading] });

  if (error) return null;

  const featured = news[0];
  const secondary = news.slice(1, 3);
  const compact = news.slice(3);

  return (
    <section id="news" className="py-24 bg-[#0c0c0c]">
      <div className="mx-auto max-w-[1100px] px-6">
        <NewsHeader />
        {loading ? (
          <NewsSkeleton />
        ) : news.length > 0 ? (
          <div ref={sectionRef}>
            {featured && <FeaturedCard item={featured} />}

            {secondary.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                {secondary.map((item) => (
                  <SecondaryCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {compact.length > 0 && (
              <div className="mt-10 pt-6 border-t border-white/[0.06]">
                {compact.map((item) => (
                  <CompactItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
