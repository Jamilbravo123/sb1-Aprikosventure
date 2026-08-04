import { useEffect, useState, type ReactNode } from 'react';
import {
  deleteMilestoneAt, deleteProject, getProjectBySlug, listProjectMilestones, listProjects,
  saveMilestone, saveProject, uploadProjectLogo,
} from '../../lib/boardApi';
import type { BoardMilestone, BoardProject, MilestoneStatus } from '../../types/board';
import ProjectDocumentsSection from './ProjectDocumentsSection';

const STATUSES: MilestoneStatus[] = ['planlagt', 'pågår', 'fullført', 'forsinket'];
const LOGO_ACCEPT = 'image/png,image/jpeg,image/svg+xml,image/webp';

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

const field = 'w-full bg-transparent border border-[var(--deck-rule)] p-2 deck-lede';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="deck-kicker block mb-1">{label}</label>
      {children}
    </div>
  );
}

function ProjectEditor({ project, onSaved, onCreated }: {
  project: BoardProject | null;
  onSaved: () => void;
  onCreated?: (p: BoardProject) => void;
}) {
  const [name, setName] = useState(project?.name ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [ownershipPct, setOwnershipPct] = useState(project?.ownership_pct?.toString() ?? '');
  const [ownershipNote, setOwnershipNote] = useState(project?.ownership_note ?? '');
  const [partners, setPartners] = useState(project?.partners ?? '');
  const [companyName, setCompanyName] = useState(project?.company_name ?? '');
  const [companyOrgnr, setCompanyOrgnr] = useState(project?.company_orgnr ?? '');
  const [sortOrder, setSortOrder] = useState(project?.sort_order ?? 0);
  const [isArchived, setIsArchived] = useState(project?.is_archived ?? false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoRemoved, setLogoRemoved] = useState(false);
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

  const currentLogoUrl = logoRemoved ? null : (project?.logo_url ?? null);

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoRemoved(true);
  };

  const handleSave = async () => {
    setStatus(null);
    try {
      let logoUrl: string | null = project?.logo_url ?? null;
      if (logoRemoved) logoUrl = null;
      if (logoFile) logoUrl = await uploadProjectLogo(logoFile);

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
        logo_url: logoUrl,
      };
      if (project) payload.id = project.id;
      await saveProject(payload);
      setStatus('Lagret.');

      if (!project) {
        const created = await getProjectBySlug(payload.slug);
        if (created && onCreated) {
          onCreated(created);
          return;
        }
      }
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

  return (
    <div className="border border-[var(--deck-rule)] p-6 space-y-4">
      <Field label="Navn">
        <input className={field} value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Beskrivelse">
        <textarea className={field} value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Eierandel (%)">
          <input className={field} type="number" min={0} max={100} step="0.01"
            value={ownershipPct} onChange={(e) => setOwnershipPct(e.target.value)} />
        </Field>
        <Field label="Partnere">
          <input className={field} placeholder="f.eks. NBX, Pharma Nordic"
            value={partners} onChange={(e) => setPartners(e.target.value)} />
        </Field>
        <Field label="Eierskapsnotat (valgfritt)">
          <input className={field} placeholder="f.eks. 50/50 JV"
            value={ownershipNote} onChange={(e) => setOwnershipNote(e.target.value)} />
        </Field>
        <Field label="Selskapsnavn (hvis stiftet)">
          <input className={field} value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </Field>
        <Field label="Org.nr">
          <input className={field} value={companyOrgnr} onChange={(e) => setCompanyOrgnr(e.target.value)} />
        </Field>
        <Field label="Sortering">
          <input className={field} type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
        </Field>
        <Field label="Logo (valgfritt)">
          <div className="space-y-2">
            {currentLogoUrl && <img src={currentLogoUrl} alt="" className="h-10 w-auto" />}
            <input type="file" accept={LOGO_ACCEPT} className="deck-kicker"
              onChange={(e) => { setLogoFile(e.target.files?.[0] ?? null); setLogoRemoved(false); }} />
            {(currentLogoUrl || logoFile) && (
              <button type="button" className="deck-kicker underline" style={{ color: '#c94a4a' }}
                onClick={handleRemoveLogo}>
                Fjern logo
              </button>
            )}
          </div>
        </Field>
        <Field label="Arkivert">
          <label className="deck-kicker flex items-center gap-2">
            <input type="checkbox" checked={isArchived} onChange={(e) => setIsArchived(e.target.checked)} />
            Arkivert
          </label>
        </Field>
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

      {project && <ProjectDocumentsSection projectId={project.id} />}
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
      {openId === 'new' && (
        <ProjectEditor
          project={null}
          onSaved={refresh}
          onCreated={(p) => { setOpenId(p.id); refresh(); }}
        />
      )}
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
