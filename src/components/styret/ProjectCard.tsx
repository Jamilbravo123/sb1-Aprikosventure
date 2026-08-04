import { Link } from 'react-router-dom';
import type { BoardMilestone, BoardProject, MilestoneStatus } from '../../types/board';
import { formatShortDate } from './UpcomingMilestones';

function ownershipLabel(p: BoardProject): string {
  if (p.ownership_pct !== null) return `${p.ownership_pct} % eierandel`;
  return p.ownership_note ?? 'Eierandel ikke avklart';
}

function formatCompactDate(iso: string): string {
  return new Date(iso).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
}

const DOT_CLASS: Record<MilestoneStatus, string> = {
  fullført: 'styret-dot styret-dot-done',
  pågår: 'styret-dot styret-dot-progress',
  forsinket: 'styret-dot styret-dot-late',
  planlagt: 'styret-dot styret-dot-planned',
};

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
  // milestones er ferdigfiltrert til aktive (listAllMilestones()) — her tas kun de 3 nærmeste.
  const miniMilestones = milestones
    .slice()
    .sort((a, b) => a.target_date.localeCompare(b.target_date))
    .slice(0, 3);

  return (
    <Link
      to={`/styret/prosjekt/${project.slug}`}
      className="styret-card flex flex-col gap-2 border border-[var(--deck-rule)] p-4 sm:p-5 min-w-0"
    >
      <div className="flex items-center gap-3 min-h-[26px]">
        {project.logo_url && <img src={project.logo_url} alt="" className="h-6 w-auto max-w-[68px] object-contain shrink-0" />}
        <h3 className="deck-display text-xl min-w-0 truncate">{project.name}</h3>
        <span className="styret-card-go ml-auto text-sm shrink-0" style={{ fontFamily: 'var(--deck-f-mono)' }} aria-hidden="true">
          →
        </span>
      </div>
      <p className="deck-kicker" style={{ color: 'var(--deck-gold)' }}>
        {ownershipLabel(project)}
      </p>
      {project.partners && <p className="deck-kicker">med {project.partners}</p>}
      {project.is_archived && <p className="deck-kicker">Arkivert</p>}
      {miniMilestones.length > 0 && (
        <div className="hidden md:flex flex-col gap-1 mt-1 min-w-0">
          {miniMilestones.map((m) => (
            <div key={m.id} className="flex items-baseline gap-2 min-w-0">
              <span className={DOT_CLASS[m.status]} />
              <span className="text-xs truncate min-w-0" style={{ color: 'var(--deck-ink-dim)', fontWeight: 300 }}>
                {m.title}
              </span>
              <span
                className="ml-auto shrink-0"
                style={{ fontFamily: 'var(--deck-f-mono)', fontSize: '10px', color: 'var(--deck-ink-faint)' }}
              >
                {formatCompactDate(m.target_date)}
              </span>
            </div>
          ))}
        </div>
      )}
      {next && (
        <p className="md:hidden deck-lede text-xs truncate mt-1" style={{ fontWeight: 300 }}>
          Neste: {next.title} · {formatCompactDate(next.target_date)}
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
