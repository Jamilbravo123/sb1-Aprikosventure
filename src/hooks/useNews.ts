import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { NewsItem } from '../types/news';

export function useNews(limit = 6) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error: fetchError } = await supabase
          .from('news')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false })
          .limit(limit);

        if (fetchError) throw fetchError;
        setNews(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news');
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [limit]);

  return { news, loading, error };
}
