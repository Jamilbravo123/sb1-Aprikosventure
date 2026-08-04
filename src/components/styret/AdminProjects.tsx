import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  deleteMilestone, deleteProject, getProjectBySlug, listProjectMilestones, listProjects,
  removeProjectLogoFile, saveMilestone, saveProject, setMilestoneArchived, uploadProjectLogo,
} from '../../lib/boardApi';
import type { BoardMilestone, BoardProject, MilestoneStatus } from '../../types/board';
import { formatDate } from './UpcomingMilestones';
import ProjectDocumentsSection from './ProjectDocumentsSection';

const STATUSES: MilestoneStatus[] = ['planlagt', 'pågår', 'fullført', 'forsinket'];
const LOGO_ACCEPT = 'image/png,image/jpeg,image/svg+xml,image/webp';

function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/[æå]/g, 'a').replace(/ø/g, 'o')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

interface MilestoneRow {
  id?: string;
  title: string;
  target_date: string;
  status: MilestoneStatus;
  created_at?: string;
  updated_at?: string;
}

function toRow(m: BoardMilestone): MilestoneRow {
  return {
    id: m.id, title: m.title, target_date: m.target_date, status: m.status,
    created_at: m.created_at, updated_at: m.updated_at,
  };
}

function sortByTargetDate<T extends { target_date: string }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.target_date.localeCompare(b.target_date));
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
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [activeRows, setActiveRows] = useState<MilestoneRow[]>([]);
  const [archived, setArchived] = useState<BoardMilestone[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const projectId = project?.id ?? null;

  const previewUrl = useMemo(
    () => (logoFile ? URL.createObjectURL(logoFile) : null),
    [logoFile],
  );
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const reloadMilestones = async (id: string) => {
    const ms = await listProjectMilestones(id, true);
    setActiveRows(ms.filter((m) => !m.is_archived).map(toRow));
    setArchived(ms.filter((m) => m.is_archived));
  };

  useEffect(() => {
    if (!projectId) return;
    reloadMilestones(projectId);
  }, [projectId]);

  const updateRow = (i: number, patch: Partial<MilestoneRow>) => {
    setActiveRows((prev) => prev.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  };

  const addDraftRow = () => {
    setActiveRows((prev) => [...prev, { title: '', target_date: '', status: 'planlagt' }]);
  };

  const currentLogoUrl = logoRemoved ? null : (project?.logo_url ?? null);

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoRemoved(true);
    if (logoInputRef.current) logoInputRef.current.value = '';
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

      const oldLogoUrl = project?.logo_url ?? null;
      if (oldLogoUrl && oldLogoUrl !== logoUrl && oldLogoUrl.includes('/board-logos/')) {
        removeProjectLogoFile(oldLogoUrl).catch(() => {});
      }

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

  const handleSaveMilestoneRow = async (i: number) => {
    if (!project) { setStatus('Lagre prosjektet først.'); return; }
    const row = activeRows[i];
    if (!row.title || !row.target_date) {
      setStatus('Fyll ut tittel og dato for milepælen.');
      return;
    }
    try {
      const saved = await saveMilestone({
        id: row.id, project_id: project.id, title: row.title,
        target_date: row.target_date, status: row.status,
      });
      setStatus('Milepæl lagret.');
      setActiveRows((prev) => prev.map((r, j) => (j === i ? toRow(saved) : r)));
      onSaved();
    } catch (e) {
      setStatus(`Feil: ${(e as Error).message}`);
    }
  };

  const handleArchiveMilestone = async (id: string) => {
    if (!project) return;
    const row = activeRows.find((r) => r.id === id);
    if (!row) return;
    try {
      await setMilestoneArchived(id, true);
      setActiveRows((prev) => prev.filter((r) => r.id !== id));
      const archivedRow: BoardMilestone = {
        id,
        project_id: project.id,
        title: row.title,
        target_date: row.target_date,
        status: row.status,
        is_archived: true,
        created_at: row.created_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setArchived((prev) => sortByTargetDate([...prev, archivedRow]));
      onSaved();
    } catch (e) {
      setStatus(`Feil: ${(e as Error).message}`);
    }
  };

  const handleReopenMilestone = async (id: string) => {
    if (!project) return;
    const row = archived.find((m) => m.id === id);
    if (!row) return;
    try {
      await setMilestoneArchived(id, false);
      setArchived((prev) => prev.filter((m) => m.id !== id));
      setActiveRows((prev) => sortByTargetDate([...prev, toRow(row)]));
      onSaved();
    } catch (e) {
      setStatus(`Feil: ${(e as Error).message}`);
    }
  };

  const handleDeleteMilestone = async (id: string | undefined, draftIndex?: number) => {
    if (!project) return;
    if (!id) {
      // Draft-rad uten id: ingen server-rad å slette, fjern kun lokalt.
      if (draftIndex !== undefined) {
        setActiveRows((prev) => prev.filter((_, j) => j !== draftIndex));
      }
      return;
    }
    if (!window.confirm('Slette milepælen? Dette er kun ment for feilregistreringer — bruk «Arkiver» for historikk.')) return;
    try {
      await deleteMilestone(id);
      setActiveRows((prev) => prev.filter((r) => r.id !== id));
      setArchived((prev) => prev.filter((m) => m.id !== id));
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
            {(previewUrl ?? currentLogoUrl) && (
              <div className="space-y-1">
                <img src={previewUrl ?? currentLogoUrl ?? undefined} alt="" className="h-10 w-auto" />
                {previewUrl && <p className="deck-kicker">(ikke lagret ennå)</p>}
              </div>
            )}
            <input ref={logoInputRef} type="file" accept={LOGO_ACCEPT} className="deck-kicker"
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
          <p className="deck-eyebrow">Milepæler</p>
          {activeRows.map((row, i) => (
            <div key={row.id ?? `draft-${i}`} className="grid md:grid-cols-4 gap-2 items-center">
              <input className={field} placeholder="Tittel"
                value={row.title}
                onChange={(e) => updateRow(i, { title: e.target.value })} />
              <input className={field} type="date"
                value={row.target_date}
                onChange={(e) => updateRow(i, { target_date: e.target.value })} />
              <select className={field} value={row.status}
                onChange={(e) => updateRow(i, { status: e.target.value as MilestoneStatus })}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="flex gap-3">
                <button className="deck-kicker underline" onClick={() => handleSaveMilestoneRow(i)}>Lagre</button>
                {row.id && (
                  <button className="deck-kicker underline" onClick={() => handleArchiveMilestone(row.id!)}>
                    Arkiver
                  </button>
                )}
                <button className="deck-kicker underline" style={{ color: '#c94a4a' }}
                  onClick={() => handleDeleteMilestone(row.id, i)}>
                  Slett
                </button>
              </div>
            </div>
          ))}
          <button className="deck-kicker underline" onClick={addDraftRow}>+ Legg til milepæl</button>

          <div className="pt-4 border-t border-[var(--deck-rule)]">
            <button className="deck-kicker underline" onClick={() => setHistoryOpen((v) => !v)}>
              {historyOpen ? 'Skjul historikk' : `Historikk (${archived.length})`}
            </button>
            {historyOpen && (
              <div className="space-y-2 mt-3">
                {archived.length === 0 ? (
                  <p className="deck-kicker">Ingen arkiverte milepæler.</p>
                ) : archived.map((m) => (
                  <div key={m.id} className="flex items-baseline gap-3 flex-wrap" style={{ opacity: 0.6 }}>
                    <span className="deck-lede">{m.title}</span>
                    <span className="deck-kicker">{m.status} · {formatDate(m.target_date)}</span>
                    <button className="deck-kicker underline" onClick={() => handleReopenMilestone(m.id)}>
                      Gjenåpne
                    </button>
                    <button className="deck-kicker underline" style={{ color: '#c94a4a' }}
                      onClick={() => handleDeleteMilestone(m.id)}>
                      Slett
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
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
          onCreated={(p) => {
            setProjects((prev) => [...prev, p]);
            setOpenId(p.id);
            refresh();
          }}
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
