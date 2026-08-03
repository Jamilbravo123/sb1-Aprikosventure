import { useEffect, useState, type FormEvent } from 'react';
import { deleteDocument, listDocuments, listProjects, uploadDocument } from '../../lib/boardApi';
import type { BoardDocument, BoardProject } from '../../types/board';
import { formatDate } from './UpcomingMilestones';

export default function AdminDocuments() {
  const [documents, setDocuments] = useState<BoardDocument[]>([]);
  const [projects, setProjects] = useState<BoardProject[]>([]);
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<BoardDocument['doc_type']>('protokoll');
  const [meetingDate, setMeetingDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    Promise.all([listDocuments(), listProjects(true)]).then(([docs, projs]) => {
      setDocuments(docs);
      setProjects(projs);
    }).catch(() => setStatus('Kunne ikke laste dokumentene.'));
  }, [refreshKey]);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setStatus('Laster opp …');
    try {
      await uploadDocument(file, {
        title,
        doc_type: docType,
        meeting_date: meetingDate || null,
        project_id: projectId || null,
      });
      setStatus('Lastet opp.');
      setTitle(''); setMeetingDate(''); setProjectId(''); setFile(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setStatus(`Feil: ${(err as Error).message}`);
    }
  };

  const handleDelete = async (doc: BoardDocument) => {
    if (!window.confirm(`Slette «${doc.title}»?`)) return;
    try {
      await deleteDocument(doc);
      setStatus('Slettet.');
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setStatus(`Feil: ${(err as Error).message}`);
    }
  };

  const field = 'w-full bg-transparent border border-[var(--deck-rule)] p-2 deck-lede';

  return (
    <div className="space-y-8">
      <form onSubmit={handleUpload} className="border border-[var(--deck-rule)] p-6 space-y-4">
        <p className="deck-eyebrow">Last opp dokument (kun PDF)</p>
        <input className={field} placeholder="Tittel" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="grid md:grid-cols-3 gap-4">
          <select className={field} value={docType} onChange={(e) => setDocType(e.target.value as BoardDocument['doc_type'])}>
            <option value="protokoll">protokoll</option>
            <option value="referat">referat</option>
            <option value="annet">annet</option>
          </select>
          <input className={field} type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} />
          <select className={field} value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="">Selskapsnivå</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <input type="file" accept="application/pdf" required
          onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="deck-kicker" />
        <button type="submit" className="deck-btn-primary">Last opp</button>
        {status && <p className="deck-kicker">{status}</p>}
      </form>

      <ul className="space-y-2">
        {documents.map((d) => (
          <li key={d.id} className="flex items-baseline gap-4">
            <span className="deck-lede">{d.title}</span>
            <span className="deck-kicker">
              {d.doc_type}{d.meeting_date && ` · ${formatDate(d.meeting_date)}`}
            </span>
            <button className="deck-kicker underline ml-auto" style={{ color: '#c94a4a' }}
              onClick={() => handleDelete(d)}>Slett</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
