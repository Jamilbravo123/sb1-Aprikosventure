import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getDocumentUrl, getProjectBySlug, listDocuments, listProjectMilestones,
} from '../../lib/boardApi';
import type { BoardDocument, BoardMilestone, BoardProject as Project } from '../../types/board';
import MilestoneStepper from '../../components/styret/MilestoneStepper';
import { formatDate } from '../../components/styret/UpcomingMilestones';

export default function BoardProject() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<BoardMilestone[]>([]);
  const [documents, setDocuments] = useState<BoardDocument[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'notfound' | 'error'>('loading');
  const [docError, setDocError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setState('loading');
    getProjectBySlug(slug)
      .then(async (p) => {
        if (cancelled) return;
        if (!p) { setState('notfound'); return; }
        setProject(p);
        const [ms, docs] = await Promise.all([
          listProjectMilestones(p.id),
          listDocuments(p.id),
        ]);
        if (cancelled) return;
        setMilestones(ms);
        setDocuments(docs);
        setState('ready');
      })
      .catch(() => { if (!cancelled) setState('error'); });
    return () => { cancelled = true; };
  }, [slug]);

  const openDocument = async (doc: BoardDocument) => {
    setDocError(null);
    // Vinduet må åpnes synkront FØR await — ellers blokkerer Safari/Chrome popupen.
    const win = window.open('about:blank', '_blank');
    if (win) win.opener = null;
    try {
      const url = await getDocumentUrl(doc.file_path);
      if (win) {
        win.location.href = url;
      } else {
        window.location.assign(url);
      }
    } catch {
      win?.close();
      setDocError('Kunne ikke åpne dokumentet. Prøv igjen.');
    }
  };

  if (state === 'loading') {
    return <div className="deck-page min-h-screen flex items-center justify-center"><p className="deck-kicker">Laster …</p></div>;
  }
  if (state === 'notfound' || state === 'error' || !project) {
    return (
      <div className="deck-page min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="deck-lede">{state === 'notfound' ? 'Fant ikke prosjektet.' : 'Kunne ikke laste prosjektet.'}</p>
        <Link to="/styret" className="deck-kicker underline">Til forsiden</Link>
      </div>
    );
  }

  return (
    <div className="deck-page min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <Link to="/styret" className="deck-kicker underline">← Styreportal</Link>
        <header>
          <h1 className="deck-display text-5xl">{project.name}</h1>
          <p className="deck-kicker mt-3" style={{ color: 'var(--deck-gold)' }}>
            {project.ownership_pct !== null ? `${project.ownership_pct} % eierandel` : 'Eierandel ikke avklart'}
            {project.ownership_note && ` · ${project.ownership_note}`}
          </p>
          {project.partners && (<p className="deck-kicker mt-1">Partnerskap med {project.partners}</p>)}
          {project.company_name && (
            <p className="deck-kicker mt-1">
              {project.company_name}{project.company_orgnr && ` · org.nr ${project.company_orgnr}`}
            </p>
          )}
          {!project.company_name && (
            <p className="deck-kicker mt-1">Prosjekt — ikke etablert som eget selskap</p>
          )}
        </header>

        {project.description && <p className="deck-lede">{project.description}</p>}

        <section>
          <p className="deck-eyebrow">De tre viktigste milepælene</p>
          <MilestoneStepper milestones={milestones} />
        </section>

        <section>
          <p className="deck-eyebrow">Dokumenter</p>
          {documents.length === 0 ? (
            <p className="deck-lede mt-3">Ingen dokumenter ennå.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {documents.map((d) => (
                <li key={d.id}>
                  <button className="deck-lede underline text-left" onClick={() => openDocument(d)}>
                    {d.title}
                  </button>
                  <span className="deck-kicker ml-3">
                    {d.doc_type}{d.meeting_date && ` · ${formatDate(d.meeting_date)}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {docError && <p className="deck-kicker mt-2" style={{ color: '#c94a4a' }}>{docError}</p>}
        </section>
      </div>
    </div>
  );
}
