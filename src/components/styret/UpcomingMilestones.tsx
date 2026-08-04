import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { MilestoneWithProject } from '../../types/board';

const STATUS_COLOR: Record<string, string> = {
  planlagt: 'var(--deck-ink-dim)',
  'pågår': 'var(--deck-gold)',
  forsinket: '#c94a4a',
};

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('nb-NO', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function UpcomingMilestones({ items }: { items: MilestoneWithProject[] }) {
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, 8);

  if (items.length === 0) {
    return (
      <section className="border border-[var(--deck-rule)] p-6">
        <p className="deck-eyebrow">Kommende milepæler</p>
        <p className="deck-lede mt-3">Ingen kommende milepæler.</p>
      </section>
    );
  }

  return (
    <section className="border border-[var(--deck-rule)]">
      <button
        type="button"
        className="w-full flex items-center justify-between gap-4 p-6 text-left"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="deck-eyebrow">Kommende milepæler ({items.length})</span>
        <span className="flex items-center gap-3">
          <span className="deck-kicker">Neste: {formatDate(items[0].target_date)}</span>
          <span aria-hidden="true">{open ? '▾' : '▸'}</span>
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6">
          <ol className="space-y-3">
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
          {items.length > 8 && !showAll && (
            <button className="deck-kicker mt-4 underline" onClick={() => setShowAll(true)}>
              Se alle ({items.length})
            </button>
          )}
        </div>
      )}
    </section>
  );
}
