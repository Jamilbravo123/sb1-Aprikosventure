import { formatShortDate } from './UpcomingMilestones';

function KpiTile({ num, label, sub }: { num: number; label: string; sub?: string }) {
  return (
    <div className="border border-[var(--deck-rule)] px-3.5 sm:px-4 py-3 flex flex-col gap-1">
      <span className="deck-display text-[28px] sm:text-[34px] font-medium leading-none tabular-nums">
        {num}
      </span>
      <span className="deck-kicker">{label}</span>
      {sub && <span className="text-xs" style={{ color: 'var(--deck-ink-faint)', fontWeight: 300 }}>{sub}</span>}
    </div>
  );
}

export default function KpiRow({
  activeProjects, upcomingCount, nextDeadline, inProgressCount, newSinceLast, lastSeenAt,
}: {
  activeProjects: number;
  upcomingCount: number;
  nextDeadline: string | null;
  inProgressCount: number;
  newSinceLast: number;
  lastSeenAt: string | null;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <KpiTile num={activeProjects} label="Aktive prosjekter" />
      <KpiTile
        num={upcomingCount}
        label="Kommende milepæler"
        sub={nextDeadline ? `Neste frist: ${formatShortDate(nextDeadline)}` : undefined}
      />
      <KpiTile num={inProgressCount} label="Milepæler pågår" />
      <KpiTile
        num={newSinceLast}
        label="Nytt siden sist"
        sub={lastSeenAt ? `siste besøk ${formatShortDate(lastSeenAt)}` : undefined}
      />
    </div>
  );
}
