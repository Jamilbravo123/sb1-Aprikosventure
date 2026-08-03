import { useEffect, useState } from 'react';
import {
  deleteMilestoneAt, deleteProject, listProjectMilestones, listProjects,
  saveMilestone, saveProject,
} from '../../lib/boardApi';
import type { BoardMilestone, BoardProject, MilestoneStatus } from '../../types/board';

const STATUSES: MilestoneStatus[] = ['planlagt', 'pågår', 'fullført', 'forsinket'];

function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/[æå]/g, 'a').replace(/ø/g, 'o')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

interface MilestoneDraft {
  title: string;
  target_date: string;
  status: MilestoneStatus;
}

function ProjectEditor({ project, onSaved }: { project: BoardProject | null; onSaved: () => void }) {
  const [name, setName] = useState(project?.name ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [ownershipPct, setOwnershipPct] = useState(project?.ownership_pct?.toString() ?? '');
  const [ownershipNote, setOwnershipNote] = useState(project?.ownership_note ?? '');
  const [partners, setPartners] = useState(project?.partners ?? '');
  const [companyName, setCompanyName] = useState(project?.company_name ?? '');
  const [companyOrgnr, setCompanyOrgnr] = useState(project?.company_orgnr ?? '');
  const [sortOrder, setSortOrder] = useState(project?.sort_order ?? 0);
  const [isArchived, setIsArchived] = useState(project?.is_archived ?? false);
  const [slots, setSlots] = useState<(MilestoneDraft | null)[]>([null, null, null]);
  const [status, setStatus] = useState<string | null>(null);
  const projectId = project?.id ?? null;

  useEffect(() => {
    if (!projectId) return;
    listProjectMilestones(projectId).then((ms) => {
      const next: (MilestoneDraft | null)[] = [null, null, null];
      ms.forEach((m: BoardMilestone) => {
        next[m.position - 1] = { title: m.title, target_date: m.target_date, status: m.status };
      });
      setSlots(next);
    });
  }, [projectId]);

  const setSlot = (i: number, draft: MilestoneDraft | null) => {
    setSlots((prev) => prev.map((s, j) => (j === i ? draft : s)));
  };

  const handleSave = async () => {
    setStatus(null);
    try {
      const payload: Partial<BoardProject> & { name: string; slug: string } = {
        name,
        slug: project?.slug ?? slugify(name),
        description: description || null,
        ownership_pct: ownershipPct === '' ? null : Number(ownershipPct),
        ownership_note: ownershipNote || null,
        partners: partners || null,
        company_name: companyName || null,
        company_orgnr: companyOrgnr || null,
        sort_order: sortOrder,
        is_archived: isArchived,
      };
      if (project) payload.id = project.id;
      await saveProject(payload);
      setStatus('Lagret.');
      onSaved();
    } catch (e) {
      const msg = (e as Error).message;
      setStatus(msg.includes('duplicate key')
        ? 'Feil: et prosjekt med samme slug finnes allerede.'
        : `Feil: ${msg}`);
    }
  };

  const handleSaveMilestone = async (i: number) => {
    if (!project) { setStatus('Lagre prosjektet først.'); return; }
    const draft = slots[i];
    if (!draft || !draft.title || !draft.target_date) {
      setStatus(`Milepæl ${i + 1}: fyll ut tittel og dato.`);
      return;
    }
    try {
      await saveMilestone({
        project_id: project.id, title: draft.title,
        target_date: draft.target_date, status: draft.status, position: i + 1,
      });
      setStatus(`Milepæl ${i + 1} lagret.`);
      onSaved();
    } catch (e) {
      setStatus(`Feil: ${(e as Error).message}`);
    }
  };

  const handleDeleteMilestone = async (i: number) => {
    try {
      if (project) await deleteMilestoneAt(project.id, i + 1);
      setSlot(i, null);
      onSaved();
    } catch (e) {
      setStatus(`Feil: ${(e as Error).message}`);
    }
  };

  const field = 'w-full bg-transparent border border-[var(--deck-rule)] p-2 deck-lede';

  return (
    <div className="border border-[var(--deck-rule)] p-6 space-y-4">
      <input className={field} placeholder="Navn" value={name} onChange={(e) => setName(e.target.value)} />
      <textarea className={field} placeholder="Beskrivelse" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      <div className="grid md:grid-cols-2 gap-4">
        <input className={field} placeholder="Eierandel % (tom hvis uavklart)" type="number" min={0} max={100} step="0.01"
          value={ownershipPct} onChange={(e) => setOwnershipPct(e.target.value)} />
        <input className={field} placeholder="Eierandelsnotat (f.eks. 50/50 JV med NBX)"
          value={ownershipNote} onChange={(e) => setOwnershipNote(e.target.value)} />
        <input className={field} placeholder="Partner(e) (f.eks. NBX, Pharma Nordic)" value={partners} onChange={(e) => setPartners(e.target.value)} />
        <input className={field} placeholder="Selskapsnavn (hvis stiftet)" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        <input className={field} placeholder="Org.nr" value={companyOrgnr} onChange={(e) => setCompanyOrgnr(e.target.value)} />
        <input className={field} placeholder="Sortering" type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
        <label className="deck-kicker flex items-center gap-2">
          <input type="checkbox" checked={isArchived} onChange={(e) => setIsArchived(e.target.checked)} />
          Arkivert
        </label>
      </div>
      <button className="deck-btn-primary" onClick={handleSave}>
        {project ? 'Lagre prosjekt' : 'Opprett prosjekt'}
      </button>

      {project && (
        <div className="space-y-4 pt-4 border-t border-[var(--deck-rule)]">
          <p className="deck-eyebrow">Milepæler (maks 3)</p>
          {[0, 1, 2].map((i) => {
            const draft = slots[i];
            return (
              <div key={i} className="grid md:grid-cols-4 gap-2 items-center">
                <input className={field} placeholder={`Milepæl ${i + 1}`}
                  value={draft?.title ?? ''}
                  onChange={(e) => setSlot(i, { ...(draft ?? { target_date: '', status: 'planlagt' }), title: e.target.value })} />
                <input className={field} type="date"
                  value={draft?.target_date ?? ''}
                  onChange={(e) => setSlot(i, { ...(draft ?? { title: '', status: 'planlagt' }), target_date: e.target.value })} />
                <select className={field} value={draft?.status ?? 'planlagt'}
                  onChange={(e) => setSlot(i, { ...(draft ?? { title: '', target_date: '' }), status: e.target.value as MilestoneStatus })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="flex gap-3">
                  <button className="deck-kicker underline" onClick={() => handleSaveMilestone(i)}>Lagre</button>
                  {draft && (
                    <button className="deck-kicker underline" style={{ color: '#c94a4a' }}
                      onClick={() => handleDeleteMilestone(i)}>Slett</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {status && <p className="deck-kicker">{status}</p>}
    </div>
  );
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<BoardProject[]>([]);
  const [openId, setOpenId] = useState<string | 'new' | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [listError, setListError] = useState<string | null>(null);

  useEffect(() => {
    listProjects(true).then(setProjects).catch(() => setListError('Kunne ikke laste prosjektene.'));
  }, [refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const handleDelete = async (p: BoardProject) => {
    if (!window.confirm(`Slette «${p.name}» og alle tilhørende milepæler?`)) return;
    try {
      await deleteProject(p.id);
      refresh();
    } catch (e) {
      setListError(`Feil: ${(e as Error).message}`);
    }
  };

  return (
    <div className="space-y-4">
      <button className="deck-btn-primary" onClick={() => setOpenId('new')}>Nytt prosjekt</button>
      {listError && <p className="deck-kicker" style={{ color: '#c94a4a' }}>{listError}</p>}
      {openId === 'new' && <ProjectEditor project={null} onSaved={refresh} />}
      {projects.map((p) => (
        <div key={p.id}>
          <div className="flex items-baseline gap-4">
            <button className="deck-lede underline" onClick={() => setOpenId(openId === p.id ? null : p.id)}>
              {p.name}{p.is_archived && ' (arkivert)'}
            </button>
            <button className="deck-kicker underline" style={{ color: '#c94a4a' }} onClick={() => handleDelete(p)}>
              Slett
            </button>
          </div>
          {openId === p.id && <ProjectEditor project={p} onSaved={refresh} />}
        </div>
      ))}
    </div>
  );
}
