import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { MilestoneWithProject } from '../../types/board';
import { formatDate } from '../../lib/dateFormatter';

const STATUS_COLOR: Record<string, string> = {
  planlagt: 'var(--deck-ink-dim)',
  'pågår': 'var(--deck-gold)',
  forsinket: '#c94a4a',
};

export default function UpcomingMilestones({ items }: { items: MilestoneWithProject[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, 8);

  return (
    <section className="border border-[var(--deck-rule)] p-6">
      <p className="deck-eyebrow">Kommende milepæler</p>
      {items.length === 0 ? (
        <p className="deck-lede mt-3">Ingen kommende milepæler.</p>
      ) : (
        <ol className="mt-4 space-y-3">
          {visible.map((m) => (
            <li key={m.id} className="flex items-baseline gap-4">
              <span className="deck-kicker w-36 shrink-0">{formatDate(m.target_date)}</span>
              <span className="deck-lede">
                <Link to={`/styret/prosjekt/${m.board_projects.slug}`} className="deck-italic-gold">
                  {m.board_projects.name}
                </Link>
                {' — '}{m.title}
              </span>
              <span className="deck-kicker ml-auto shrink-0" style={{ color: STATUS_COLOR[m.status] }}>
                {m.status}
              </span>
            </li>
          ))}
        </ol>
      )}
      {items.length > 8 && !showAll && (
        <button className="deck-kicker mt-4 underline" onClick={() => setShowAll(true)}>
          Se alle ({items.length})
        </button>
      )}
    </section>
  );
}
