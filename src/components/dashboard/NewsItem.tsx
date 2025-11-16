import { ExternalLink } from 'lucide-react';
import { NewsItem as NewsItemType } from '../../types/dashboard';
import Badge from '../common/Badge';

// Icon mapping for categories (DRY principle)
const CATEGORY_ICONS: Record<string, string> = {
  'Listing': '📊',
  'BalderX': '🏗️',
  'Strategy': '🌍',
  'Portfolio': '📈',
  'Framework': '⚖️',
  'Update': '📢'
};

interface NewsItemProps {
  item: NewsItemType;
  category?: string;
}

export default function NewsItem({ item, category = 'Update' }: NewsItemProps) {
  return (
    <div className="group py-8 transition-all hover:-translate-y-0.5 cursor-pointer">
      {/* Date + Category */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-sm text-slate-400 flex items-center gap-2">
          <span className="text-base">{CATEGORY_ICONS[category]}</span>
          {item.date}
        </span>
        <Badge variant="secondary" size="sm">
          {category}
        </Badge>
      </div>

      {/* Headline */}
      <h3 className="text-xl font-semibold text-white mb-2 leading-snug 
        group-hover:text-[#B8860B] transition-colors">
        {item.title}
      </h3>

      {/* Summary */}
      <p className="text-sm text-slate-400 leading-relaxed mb-3">
        {item.summary}
      </p>

      {/* Read More Link */}
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Read more about ${item.title}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 
            hover:text-[#B8860B] transition-all group/link"
        >
          Read more
          <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
        </a>
      )}
    </div>
  );
}

