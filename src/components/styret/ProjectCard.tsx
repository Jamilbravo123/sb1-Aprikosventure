import { Link } from 'react-router-dom';
import type { BoardMilestone, BoardProject } from '../../types/board';
import { formatShortDate } from './UpcomingMilestones';

function ownershipLabel(p: BoardProject): string {
  if (p.ownership_pct !== null) return `${p.ownership_pct} % eierandel`;
  return p.ownership_note ?? 'Eierandel ikke avklart';
}

export default function ProjectCard({ project, milestones }: {
  project: BoardProject;
  milestones: BoardMilestone[];
}) {
  const total = milestones.length;
  const completed = milestones.filter((m) => m.status === 'fullført').length;
  const inProgress = milestones.filter((m) => m.status === 'pågår').length;
  const next = milestones
    .filter((m) => m.status !== 'fullført')
    .sort((a, b) => a.target_date.localeCompare(b.target_date))[0] ?? null;
  const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const inProgressPct = total > 0 ? Math.round((inProgress / total) * 100) : 0;

  return (
    <Link
      to={`/styret/prosjekt/${project.slug}`}
      className="flex flex-col gap-2 border border-[var(--deck-rule)] p-4 sm:p-5 hover:border-[var(--deck-rule-strong)] transition-colors"
    >
      <div className="flex items-center gap-3 min-h-[26px]">
        {project.logo_url && <img src={project.logo_url} alt="" className="h-6 w-auto max-w-[68px] object-contain shrink-0" />}
        <h3 className="deck-display text-xl min-w-0 truncate">{project.name}</h3>
      </div>
      <p className="deck-kicker" style={{ color: 'var(--deck-gold)' }}>
        {ownershipLabel(project)}
      </p>
      {project.partners && <p className="deck-kicker">med {project.partners}</p>}
      {project.is_archived && <p className="deck-kicker">Arkivert</p>}
      {next && (
        <p className="deck-lede text-sm truncate" style={{ fontWeight: 300 }}>
          Neste: {next.title} · {formatShortDate(next.target_date)}
        </p>
      )}
      <div className="flex items-center gap-3 mt-auto pt-2">
        {total > 0 ? (
          <>
            <span className="flex-1 h-[3px] flex" style={{ background: 'rgba(243, 236, 225, 0.16)' }}>
              <span
                className="block h-[3px] shrink-0"
                style={{ background: 'var(--deck-gold)', width: `${completedPct}%` }}
              />
              <span
                className="block h-[3px] shrink-0"
                style={{ background: 'var(--deck-gold)', opacity: 0.35, width: `${inProgressPct}%` }}
              />
            </span>
            <span className="deck-kicker whitespace-nowrap" style={{ fontSize: '10.5px' }}>
              {completed} av {total} fullført{inProgress > 0 ? ` · ${inProgress} pågår` : ''}
            </span>
          </>
        ) : (
          <span className="deck-kicker">Ingen milepæler</span>
        )}
      </div>
      <p className="deck-kicker text-[10px]" style={{ color: 'var(--deck-ink-faint)', opacity: 0.7 }}>
        Sist oppdatert {formatShortDate(project.updated_at)}
      </p>
    </Link>
  );
}
