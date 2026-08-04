import { useEffect, useState, type FormEvent } from 'react';
import { deleteDocument, listDocuments, uploadDocument } from '../../lib/boardApi';
import type { BoardDocument } from '../../types/board';
import { formatDate } from './UpcomingMilestones';

const field = 'w-full bg-transparent border border-[var(--deck-rule)] p-2 deck-lede';

export default function ProjectDocumentsSection({ projectId }: { projectId: string }) {
  const [documents, setDocuments] = useState<BoardDocument[]>([]);
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<BoardDocument['doc_type']>('protokoll');
  const [meetingDate, setMeetingDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    listDocuments(projectId).then(setDocuments).catch(() => setStatus('Kunne ikke laste dokumentene.'));
  }, [projectId, refreshKey]);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setStatus('Laster opp …');
    try {
      await uploadDocument(file, {
        title,
        doc_type: docType,
        meeting_date: meetingDate || null,
        project_id: projectId,
      });
      setStatus('Lastet opp.');
      setTitle(''); setMeetingDate(''); setFile(null);
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

  return (
    <div className="space-y-4 pt-4 border-t border-[var(--deck-rule)]">
      <p className="deck-eyebrow">Dokumenter</p>
      {documents.length > 0 && (
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
      )}
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="deck-kicker block mb-1">Tittel</label>
          <input className={field} required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="deck-kicker block mb-1">Type</label>
            <select className={field} value={docType} onChange={(e) => setDocType(e.target.value as BoardDocument['doc_type'])}>
              <option value="protokoll">protokoll</option>
              <option value="referat">referat</option>
              <option value="annet">annet</option>
            </select>
          </div>
          <div>
            <label className="deck-kicker block mb-1">Møtedato</label>
            <input className={field} type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="deck-kicker block mb-1">PDF-fil</label>
          <input type="file" accept="application/pdf" required
            onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="deck-kicker" />
        </div>
        <button type="submit" className="deck-btn-primary">Last opp</button>
        {status && <p className="deck-kicker">{status}</p>}
      </form>
    </div>
  );
}
