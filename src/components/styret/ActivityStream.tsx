import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActivity } from '../../lib/boardApi';
import type { ActivityItem } from '../../types/board';

type Period = 'dag' | 'uke' | 'mnd';

const PERIOD_LABEL: Record<Period, string> = {
  dag: 'I dag',
  uke: 'Siste uke',
  mnd: 'Siste 3 mnd',
};

const PERIOD_SHORT_LABEL: Record<Period, string> = {
  dag: 'I dag',
  uke: 'Uke',
  mnd: '3 mnd',
};

const EMPTY_LABEL: Record<Period, string> = {
  dag: 'Ingen aktivitet i dag.',
  uke: 'Ingen aktivitet siste uke.',
  mnd: 'Ingen aktivitet siste 3 måneder.',
};

const PERIODS: Period[] = ['dag', 'uke', 'mnd'];

function sinceIsoFor(period: Period): string {
  const now = new Date();
  if (period === 'dag') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  }
  if (period === 'uke') {
    return new Date(now.getTime() - 7 * 86_400_000).toISOString();
  }
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  return threeMonthsAgo.toISOString();
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

// Kompakt dato UTEN år — «3. aug.» — for å holde seg innenfor w-20-kolonnen.
// Året er implisitt for nylig aktivitet; resten av forsiden bruker år (formatShortDate).
function formatActivityDate(iso: string): string {
  return new Date(iso).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
}

function whenLabel(iso: string): string {
  const diffDays = Math.round((startOfDay(new Date()) - startOfDay(new Date(iso))) / 86_400_000);
  if (diffDays === 0) return 'I dag';
  if (diffDays === 1) return 'I går';
  return formatActivityDate(iso);
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

export default function ActivityStream() {
  const [period, setPeriod] = useState<Period>('uke');
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getActivity(sinceIsoFor(period))
      .then((data) => {
        if (cancelled) return;
        setItems(data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Kunne ikke laste aktiviteten.');
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [period]);

  return (
    <section>
      <div className="section-head flex items-baseline justify-between gap-4 flex-wrap mb-2.5">
        <div className="flex items-baseline gap-2">
          <p className="deck-eyebrow">Siste aktivitet</p>
          {!loading && !error && items.length > 0 && (
            <span className="deck-kicker">({items.length})</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {PERIODS.map((p) => {
            const active = period === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                aria-pressed={active}
                aria-label={PERIOD_LABEL[p]}
                className="deck-kicker border-b px-2 py-1 transition-colors hover:text-[var(--deck-ink-dim)]"
                style={{
                  color: active ? 'var(--deck-gold)' : 'var(--deck-ink-faint)',
                  borderColor: active ? 'var(--deck-gold)' : 'transparent',
                }}
              >
                {PERIOD_SHORT_LABEL[p]}
              </button>
            );
          })}
        </div>
      </div>

      {error && <p className="deck-kicker" style={{ color: '#c94a4a' }}>{error}</p>}
      {!error && loading && <p className="deck-kicker">Laster …</p>}
      {!error && !loading && items.length === 0 && (
        <p className="deck-kicker">{EMPTY_LABEL[period]}</p>
      )}
      {!error && !loading && items.length > 0 && (
        <div className="styret-scroll border border-[var(--deck-rule)] px-4 sm:px-5 py-1 max-h-[10rem] overflow-y-auto">
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
      )}
    </section>
  );
}
