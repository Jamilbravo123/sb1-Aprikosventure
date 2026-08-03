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
      className="block border border-[var(--deck-rule)] p-6 hover:border-[var(--deck-rule-strong)] transition-colors"
    >
      <h3 className="deck-display text-2xl">{project.name}</h3>
      <p className="deck-kicker mt-2" style={{ color: 'var(--deck-gold)' }}>
        {ownershipLabel(project)}
      </p>
      {project.partners && <p className="deck-kicker mt-1">med {project.partners}</p>}
      {project.is_archived && <p className="deck-kicker mt-1">Arkivert</p>}
      {nextMilestone && (
        <p className="deck-lede mt-4 text-sm">
          Neste: {nextMilestone.title} · {formatDate(nextMilestone.target_date)}
        </p>
      )}
    </Link>
  );
}
