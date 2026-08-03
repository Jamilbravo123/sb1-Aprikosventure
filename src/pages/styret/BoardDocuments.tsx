import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDocumentUrl, listDocuments, listProjects } from '../../lib/boardApi';
import type { BoardDocument, BoardProject } from '../../types/board';
import { formatDate } from '../../components/styret/UpcomingMilestones';

const TYPES = ['alle', 'protokoll', 'referat', 'annet'] as const;

export default function BoardDocuments() {
  const [documents, setDocuments] = useState<BoardDocument[]>([]);
  const [projects, setProjects] = useState<BoardProject[]>([]);
  const [typeFilter, setTypeFilter] = useState<(typeof TYPES)[number]>('alle');
  const [projectFilter, setProjectFilter] = useState<string>('alle');
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [docError, setDocError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([listDocuments(), listProjects(true)])
      .then(([docs, projs]) => {
        setDocuments(docs);
        setProjects(projs);
        setState('ready');
      })
      .catch(() => setState('error'));
  }, []);

  const filtered = useMemo(() => documents.filter((d) => {
    if (typeFilter !== 'alle' && d.doc_type !== typeFilter) return false;
    if (projectFilter === 'alle') return true;
    if (projectFilter === 'selskap') return d.project_id === null;
    return d.project_id === projectFilter;
  }), [documents, typeFilter, projectFilter]);

  const projectName = (id: string | null) =>
    id === null ? 'Selskapsnivå' : projects.find((p) => p.id === id)?.name ?? '';

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

  return (
    <div className="deck-page min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link to="/styret" className="deck-kicker underline">← Styreportal</Link>
        <h1 className="deck-display text-4xl">Protokoller og <span className="deck-italic-gold">referater</span></h1>

        <div className="flex flex-wrap gap-6">
          <label className="deck-kicker flex items-center gap-2">
            Type
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as (typeof TYPES)[number])}
              className="bg-transparent border border-[var(--deck-rule)] p-2">
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="deck-kicker flex items-center gap-2">
            Prosjekt
            <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-transparent border border-[var(--deck-rule)] p-2">
              <option value="alle">alle</option>
              <option value="selskap">selskapsnivå</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
        </div>

        {state === 'loading' && <p className="deck-kicker">Laster …</p>}
        {state === 'error' && <p className="deck-lede" style={{ color: '#c94a4a' }}>Kunne ikke laste dokumentene.</p>}
        {state === 'ready' && (filtered.length === 0 ? (
          <p className="deck-leve">Ingen dokumenter ennå.</p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((d) => (
              <li key={d.id} className="border-b border-[var(--deck-rule)] pb-3">
                <button className="deck-lede underline text-left" onClick={() => openDocument(d)}>
                  {d.title}
                </button>
                <p className="deck-kicker mt-1">
                  {d.doc_type} · {projectName(d.project_id)}
                  {d.meeting_date && ` · ${formatDate(d.meeting_date)}`}
                </p>
              </li>
            ))}
          </ul>
        ))}
        {docError && <p className="deck-kicker mt-2" style={{ color: '#c94a4a' }}>{docError}</p>}
      </div>
    </div>
  );
}
