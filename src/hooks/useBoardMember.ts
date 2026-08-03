import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentMember } from '../lib/boardApi';
import type { BoardMember } from '../types/board';

export function useBoardMember(): { member: BoardMember | null; loading: boolean } {
  const { user, loading: authLoading } = useAuth();
  const [member, setMember] = useState<BoardMember | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = user?.id ?? null;
  const prevUserId = useRef<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (userId !== prevUserId.current) {
      // Brukerbytte (null→bruker, bruker→annen bruker, bruker→null):
      // aldri vis forrige brukers medlemsdata.
      prevUserId.current = userId;
      setMember(null);
    }
    if (!userId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getCurrentMember()
      .then((m) => { if (!cancelled) setMember(m); })
      .catch(() => {
        // Forbigående feil innenfor SAMME brukers økt beholder forrige verdi.
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId, authLoading]);

  return { member, loading };
}
