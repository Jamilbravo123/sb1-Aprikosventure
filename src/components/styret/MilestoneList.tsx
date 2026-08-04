import { useState } from 'react';
import type { BoardMilestone, MilestoneStatus } from '../../types/board';
import { formatShortDate } from './UpcomingMilestones';

const DOT_CLASS: Record<MilestoneStatus, string> = {
  fullført: 'styret-dot styret-dot-done',
  pågår: 'styret-dot styret-dot-progress',
  forsinket: 'styret-dot styret-dot-late',
  planlagt: 'styret-dot styret-dot-planned',
};

function MilestoneRow({ milestone, dimmed }: { milestone: BoardMilestone; dimmed?: boolean }) {
  return (
    <div
      className="flex items-baseline gap-3 py-2 border-t border-[var(--deck-rule-strong)] flex-wrap"
      style={dimmed ? { opacity: 0.55 } : undefined}
    >
      <span className={DOT_CLASS[milestone.status]} />
      <span className="deck-lede text-sm min-w-0 flex-1 break-words" style={{ fontWeight: 300 }}>
        {milestone.title}
      </span>
      <span className="deck-kicker ml-auto shrink-0">
        {milestone.status !== 'fullført' && '(anslått) '}
        {formatShortDate(milestone.target_date)}
      </span>
    </div>
  );
}

export default function MilestoneList({ milestones, archivedMilestones = [] }: {
  milestones: BoardMilestone[];
  archivedMilestones?: BoardMilestone[];
}) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const sorted = [...milestones].sort((a, b) => a.target_date.localeCompare(b.target_date));
  const sortedArchived = [...archivedMilestones].sort((a, b) => a.target_date.localeCompare(b.target_date));

  return (
    <div className="mt-6">
      {sorted.length === 0 ? (
        <p className="deck-kicker">Ingen milepæler ennå.</p>
      ) : (
        <div>
          {sorted.map((m) => <MilestoneRow key={m.id} milestone={m} />)}
        </div>
      )}
      {sortedArchived.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[var(--deck-rule)]">
          <button
            type="button"
            className="deck-kicker underline"
            aria-expanded={historyOpen}
            onClick={() => setHistoryOpen((v) => !v)}
          >
            {historyOpen ? 'Skjul historikk' : `Historikk (${sortedArchived.length})`}
          </button>
          {historyOpen && (
            <div className="mt-2">
              {sortedArchived.map((m) => <MilestoneRow key={m.id} milestone={m} dimmed />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
