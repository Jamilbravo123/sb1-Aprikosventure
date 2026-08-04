import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { MilestoneStatus, MilestoneWithProject } from '../../types/board';

const STATUS_COLOR: Record<MilestoneStatus, string> = {
  planlagt: 'var(--deck-ink-dim)',
  'pågår': 'var(--deck-gold)',
  fullført: 'var(--deck-ink-faint)',
  forsinket: '#c94a4a',
};

// pågår sorteres foran planlagt/forsinket innen samme dato.
const STATUS_ORDER: Record<MilestoneStatus, number> = {
  'pågår': 0,
  planlagt: 1,
  forsinket: 1,
  fullført: 2,
};

const VISIBLE_ROWS = 5;

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('nb-NO', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('nb-NO', {
    day: 'numeric', month: 'short',
  });
}

type Row =
  | { type: 'header'; date: string }
  | { type: 'row'; milestone: MilestoneWithProject };

function buildRows(milestones: MilestoneWithProject[], initialDate: string | null): Row[] {
  const rows: Row[] = [];
  let lastDate = initialDate;
  for (const m of milestones) {
    if (m.target_date !== lastDate) {
      rows.push({ type: 'header', date: m.target_date });
      lastDate = m.target_date;
    }
    rows.push({ type: 'row', milestone: m });
  }
  return rows;
}

function MilestoneRow({ milestone, first }: { milestone: MilestoneWithProject; first: boolean }) {
  return (
    <div
      className={`flex items-baseline gap-4 py-2 flex-wrap ${first ? 'mt-2' : 'border-t border-[var(--deck-rule)]'}`}
    >
      <span className="deck-lede text-sm min-w-0 flex-1 break-words" style={{ color: 'var(--deck-ink-dim)', fontWeight: 300 }}>
        <Link to={`/styret/prosjekt/${milestone.board_projects.slug}`} className="deck-italic-gold">
          {milestone.board_projects.name}
        </Link>
        {' — '}{milestone.title}
      </span>
      <span
        className="deck-kicker ml-auto shrink-0"
        style={{ color: STATUS_COLOR[milestone.status] }}
      >
        {milestone.status}
      </span>
    </div>
  );
}

export default function UpcomingMilestones({ items }: { items: MilestoneWithProject[] }) {
  const [showAll, setShowAll] = useState(false);

  if (items.length === 0) {
    return (
      <section>
        <p className="deck-eyebrow">Kommende milepæler</p>
        <p className="deck-kicker mt-3">Ingen kommende milepæler.</p>
      </section>
    );
  }

  const sorted = [...items].sort((a, b) => {
    const dateCmp = a.target_date.localeCompare(b.target_date);
    if (dateCmp !== 0) return dateCmp;
    const statusCmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (statusCmp !== 0) return statusCmp;
    return a.board_projects.name.localeCompare(b.board_projects.name, 'nb-NO');
  });

  const visibleMilestones = sorted.slice(0, VISIBLE_ROWS);
  const hiddenMilestones = sorted.slice(VISIBLE_ROWS);
  const lastVisibleDate = visibleMilestones[visibleMilestones.length - 1]?.target_date ?? null;

  const visibleRows = buildRows(visibleMilestones, null);
  const hiddenRows = buildRows(hiddenMilestones, lastVisibleDate);

  let rowIndex = 0;
  const renderRows = (rows: Row[]) => rows.map((r) => {
    if (r.type === 'header') {
      return (
        <p key={`h-${r.date}`} className="deck-kicker mt-4 mb-1" style={{ color: 'var(--deck-gold)' }}>
          {formatDate(r.date)}
        </p>
      );
    }
    rowIndex += 1;
    const first = rowIndex === 1;
    return <MilestoneRow key={r.milestone.id} milestone={r.milestone} first={first} />;
  });

  return (
    <section className="border border-[var(--deck-rule)] p-5 sm:p-6">
      <div className="section-head flex items-baseline justify-between gap-4 flex-wrap">
        <p className="deck-eyebrow">Kommende milepæler</p>
        <span className="deck-kicker">{items.length} totalt</span>
      </div>
      {renderRows(visibleRows)}
      {showAll && renderRows(hiddenRows)}
      {hiddenMilestones.length > 0 && (
        <p className="mt-4">
          <button
            type="button"
            className="deck-kicker underline"
            aria-expanded={showAll}
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? 'Vis færre' : `Vis alle (${items.length})`}
          </button>
        </p>
      )}
    </section>
  );
}
