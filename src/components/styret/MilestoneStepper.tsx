import type { BoardMilestone } from '../../types/board';
import { formatDate } from './UpcomingMilestones';

const NODE_STYLE: Record<string, { background: string; border: string }> = {
  'fullført': { background: 'var(--deck-gold)', border: 'var(--deck-gold)' },
  'pågår': { background: 'var(--deck-bg)', border: 'var(--deck-gold)' },
  forsinket: { background: 'var(--deck-bg)', border: '#c94a4a' },
  planlagt: { background: 'var(--deck-bg)', border: 'var(--deck-rule-strong)' },
};

export default function MilestoneStepper({ milestones }: { milestones: BoardMilestone[] }) {
  const slots = [1, 2, 3].map(
    (pos) => milestones.find((m) => m.position === pos) ?? null,
  );

  return (
    <div className="grid md:grid-cols-3 gap-0 mt-6">
      {slots.map((m, i) => (
        <div key={i} className="relative px-4 pb-2 pt-6 border-t border-[var(--deck-rule-strong)]">
          <span
            className="absolute -top-[7px] left-4 inline-block w-3.5 h-3.5 rounded-full border-2"
            style={m ? NODE_STYLE[m.status] : NODE_STYLE.planlagt}
          />
          {m ? (
            <>
              <p className="deck-kicker" style={{ color: 'var(--deck-gold)' }}>
                Milepæl {m.position} · {m.status}
              </p>
              <p className="deck-lede mt-1">{m.title}</p>
              <p className="deck-kicker mt-2">
                {formatDate(m.target_date)}
                {m.status !== 'fullført' && ' (anslått)'}
              </p>
            </>
          ) : (
            <p className="deck-kicker">Ikke definert</p>
          )}
        </div>
      ))}
    </div>
  );
}
