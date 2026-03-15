import { ExternalLink } from 'lucide-react';
import type { NewsItem } from '../../../types/news';
import { categoryLabels, categoryColors } from '../../../types/news';

interface NewsCardProps {
  item: NewsItem;
}

export default function NewsCard({ item }: NewsCardProps) {
  const date = new Date(item.published_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="news-card group relative overflow-hidden rounded-2xl bg-[#141420]/50 backdrop-blur-sm border border-white/5 p-6 transition-all duration-500 hover:border-[#C9935E]/30 hover:shadow-lg hover:shadow-[#C9935E]/5">
      <div className="flex flex-col h-full">
        {/* Category + Date */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${categoryColors[item.category]}`}>
            {categoryLabels[item.category]}
          </span>
          <time className="text-xs text-slate-500">{date}</time>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#E8C896] transition-colors line-clamp-2">
          {item.title}
        </h3>

        {/* Summary */}
        <p className="text-sm text-slate-400 leading-relaxed flex-1 line-clamp-3">
          {item.summary}
        </p>

        {/* Link */}
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-[#C9935E]/60 hover:text-[#C9935E] text-xs font-medium transition-colors"
          >
            Read more
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </article>
  );
}
