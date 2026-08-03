import { Link } from 'react-router-dom';
import type { SinceLast } from '../../types/board';

export default function SinceLastPanel({ data, firstVisit }: { data: SinceLast; firstVisit: boolean }) {
  const empty = data.newProjects.length === 0
    && data.changedMilestones.length === 0
    && data.newDocuments.length === 0;

  return (
    <section className="border border-[var(--deck-rule)] p-6">
      <p className="deck-eyebrow">Siden sist</p>
      {firstVisit ? (
        <p className="deck-lede mt-3">Velkommen til Styreportalen. Dette er ditt første besøk.</p>
      ) : empty ? (
        <p className="deck-lede mt-3">Ingenting nytt siden sist.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {data.newProjects.map((p) => (
            <li key={p.id} className="deck-lede">
              Nytt prosjekt: <Link to={`/styret/prosjekt/${p.slug}`} className="deck-italic-gold">{p.name}</Link>
            </li>
          ))}
          {data.changedMilestones.map((m) => (
            <li key={m.id} className="deck-lede">
              Milepæl oppdatert i <Link to={`/styret/prosjekt/${m.board_projects.slug}`} className="deck-italic-gold">{m.board_projects.name}</Link>: {m.title}
            </li>
          ))}
          {data.newDocuments.map((d) => (
            <li key={d.id} className="deck-lede">
              Nytt dokument: <Link to="/styret/dokumenter" className="deck-italic-gold">{d.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
