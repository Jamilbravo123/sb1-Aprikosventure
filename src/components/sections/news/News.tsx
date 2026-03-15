import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../lib/gsap';
import { useNews } from '../../../hooks/useNews';
import NewsHeader from './NewsHeader';
import NewsCard from './NewsCard';
import NewsSkeleton from './NewsSkeleton';

export default function News() {
  const { news, loading, error } = useNews(6);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!gridRef.current || loading) return;

    const cards = gridRef.current.querySelectorAll('.news-card');
    gsap.from(cards, {
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 80%',
        once: true,
      },
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }, { scope: gridRef, dependencies: [loading] });

  if (error) return null;

  return (
    <section id="news" className="py-24 bg-[#0c0c0c]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <NewsHeader />
        {loading ? (
          <NewsSkeleton />
        ) : news.length > 0 ? (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
