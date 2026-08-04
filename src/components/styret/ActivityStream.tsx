import { Link } from 'react-router-dom';
import type { ActivityItem } from '../../types/board';
import { formatShortDate } from './UpcomingMilestones';

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function whenLabel(iso: string): string {
  const diffDays = Math.round((startOfDay(new Date()) - startOfDay(new Date(iso))) / 86_400_000);
  if (diffDays === 0) return 'I dag';
  if (diffDays === 1) return 'I går';
  return formatShortDate(iso);
}

function ProjectLink({ name, slug }: { name: string; slug: string | null }) {
  if (!slug) return <span className="deck-italic-gold">{name}</span>;
  return (
    <Link to={`/styret/prosjekt/${slug}`} className="deck-italic-gold">
      {name}
    </Link>
  );
}

function ActivityText({ item }: { item: ActivityItem }) {
  if (item.kind === 'prosjekt') {
    return (
      <>
        Nytt prosjekt: {item.projectName && <ProjectLink name={item.projectName} slug={item.projectSlug} />}
      </>
    );
  }
  if (item.kind === 'milepæl') {
    return (
      <>
        Milepæl oppdatert i {item.projectName && <ProjectLink name={item.projectName} slug={item.projectSlug} />}: {item.label}
      </>
    );
  }
  return <>Nytt dokument: {item.label}</>;
}

export default function ActivityStream({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return <p className="deck-kicker">Ingen aktivitet ennå.</p>;
  }

  return (
    <div className="border border-[var(--deck-rule)] px-4 sm:px-5 py-1">
      {items.map((item, i) => (
        <div
          key={`${item.kind}-${item.timestamp}-${i}`}
          className={`flex items-baseline gap-4 py-2 flex-wrap text-sm ${i === 0 ? '' : 'border-t border-[var(--deck-rule)]'}`}
        >
          <span className="deck-kicker w-20 shrink-0">{whenLabel(item.timestamp)}</span>
          <span className="min-w-0 flex-1 break-words" style={{ color: 'var(--deck-ink-dim)', fontWeight: 300 }}>
            <ActivityText item={item} />
          </span>
        </div>
      ))}
    </div>
  );
}
