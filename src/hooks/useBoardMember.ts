import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentMember } from '../lib/boardApi';
import type { BoardMember } from '../types/board';

export function useBoardMember(): { member: BoardMember | null; loading: boolean } {
  const { user, loading: authLoading } = useAuth();
  const [member, setMember] = useState<BoardMember | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = user?.id ?? null;

  useEffect(() => {
    if (authLoading) return;
    if (!userId) {
      setMember(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    getCurrentMember()
      .then((m) => { if (!cancelled) setMember(m); })
      .catch(() => {
        // Forbigående feil skal ikke kaste ut et allerede verifisert medlem —
        // behold forrige verdi; en ny bruker uten verdi forblir null.
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId, authLoading]);

  return { member, loading };
}
