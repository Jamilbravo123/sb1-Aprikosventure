import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentMember } from '../lib/boardApi';
import type { BoardMember } from '../types/board';

export function useBoardMember(): { member: BoardMember | null; loading: boolean } {
  const { user, loading: authLoading } = useAuth();
  const [member, setMember] = useState<BoardMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setMember(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    getCurrentMember()
      .then((m) => { if (!cancelled) setMember(m); })
      .catch(() => { if (!cancelled) setMember(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, authLoading]);

  return { member, loading };
}
