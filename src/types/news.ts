export type NewsCategory = 'deal' | 'launch' | 'partnership' | 'milestone' | 'press';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  url?: string;
  image_url?: string;
  published_at: string;
  is_published: boolean;
}

export const categoryLabels: Record<NewsCategory, string> = {
  deal: 'Deal',
  launch: 'Launch',
  partnership: 'Partnership',
  milestone: 'Milestone',
  press: 'Press',
};

export const categoryColors: Record<NewsCategory, string> = {
  deal: 'bg-emerald-900/30 text-emerald-300 border-emerald-700/30',
  launch: 'bg-blue-900/30 text-blue-300 border-blue-700/30',
  partnership: 'bg-purple-900/30 text-purple-300 border-purple-700/30',
  milestone: 'bg-amber-900/30 text-amber-300 border-amber-700/30',
  press: 'bg-slate-700/50 text-slate-300 border-slate-600/30',
};
