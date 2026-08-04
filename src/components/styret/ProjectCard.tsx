import { Link } from 'react-router-dom';
import type { BoardMilestone, BoardProject } from '../../types/board';
import { formatDate } from './UpcomingMilestones';

function ownershipLabel(p: BoardProject): string {
  if (p.ownership_pct !== null) return `${p.ownership_pct} % eierandel`;
  return p.ownership_note ?? 'Eierandel ikke avklart';
}

export default function ProjectCard({ project, nextMilestone }: {
  project: BoardProject;
  nextMilestone: BoardMilestone | null;
}) {
  return (
    <Link
      to={`/styret/prosjekt/${project.slug}`}
      className="block border border-[var(--deck-rule)] p-5 hover:border-[var(--deck-rule-strong)] transition-colors"
    >
      <div className="flex items-center gap-3">
        {project.logo_url && <img src={project.logo_url} alt="" className="h-6 w-auto" />}
        <h3 className="deck-display text-xl">{project.name}</h3>
      </div>
      <p className="deck-kicker mt-2" style={{ color: 'var(--deck-gold)' }}>
        {ownershipLabel(project)}
      </p>
      {project.partners && <p className="deck-kicker mt-1">med {project.partners}</p>}
      {project.is_archived && <p className="deck-kicker mt-1">Arkivert</p>}
      {nextMilestone && (
        <p className="deck-lede mt-3 text-sm truncate">
          Neste: {nextMilestone.title} · {formatDate(nextMilestone.target_date)}
        </p>
      )}
    </Link>
  );
}
