import { supabase } from './supabase';
import type {
  ActivityItem, BoardDocument, BoardMember, BoardMilestone, BoardProject,
  MilestoneStatus, MilestoneWithProject, SinceLast,
} from '../types/board';

function throwIf(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}

// ── Auth / medlemskap ──────────────────────────────────────

export async function checkBoardEmail(email: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('check_board_email', { p_email: email });
  throwIf(error);
  return data === true;
}

export async function sendBoardOtp(email: string): Promise<{ error: Error | null }> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}/styret/callback` },
  });
  return { error: error as Error | null };
}

export async function getCurrentMember(): Promise<BoardMember | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return null;
  const byUserId = await supabase
    .from('board_members')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();
  throwIf(byUserId.error);
  if (byUserId.data) return byUserId.data;
  const byEmail = await supabase
    .from('board_members')
    .select('*')
    .eq('email', user.email.toLowerCase())
    .maybeSingle();
  throwIf(byEmail.error);
  return byEmail.data;
}

// Best-effort: binder user_id ved første innlogging. 0 oppdaterte rader er OK —
// raden kan allerede være bundet, og getCurrentMember matcher også på e-post.
export async function bindAndTouchMember(userId: string, email: string): Promise<void> {
  const { error } = await supabase
    .from('board_members')
    .update({ user_id: userId })
    .eq('email', email.toLowerCase())
    .is('user_id', null)
    .select('id');
  throwIf(error);
}

export async function touchLastSeen(memberId: string): Promise<void> {
  const { error } = await supabase
    .from('board_members')
    .update({ last_seen_at: new Date().toISOString() })
    .eq('id', memberId);
  throwIf(error);
}

// ── Lesing ─────────────────────────────────────────────────

export async function listProjects(includeArchived = false): Promise<BoardProject[]> {
  let query = supabase.from('board_projects').select('*')
    .order('sort_order').order('name');
  if (!includeArchived) query = query.eq('is_archived', false);
  const { data, error } = await query;
  throwIf(error);
  return data ?? [];
}

export async function getProjectBySlug(slug: string): Promise<BoardProject | null> {
  const { data, error } = await supabase
    .from('board_projects').select('*').eq('slug', slug).maybeSingle();
  throwIf(error);
  return data;
}

export async function listProjectMilestones(
  projectId: string, includeArchived = false,
): Promise<BoardMilestone[]> {
  let query = supabase
    .from('board_milestones').select('*')
    .eq('project_id', projectId).order('target_date');
  if (!includeArchived) query = query.eq('is_archived', false);
  const { data, error } = await query;
  throwIf(error);
  return data ?? [];
}

export async function listAllMilestones(): Promise<BoardMilestone[]> {
  const { data, error } = await supabase
    .from('board_milestones')
    .select('*')
    .eq('is_archived', false)
    .order('target_date');
  throwIf(error);
  return data ?? [];
}

export async function listUpcomingMilestones(): Promise<MilestoneWithProject[]> {
  const { data, error } = await supabase
    .from('board_milestones')
    .select('*, board_projects!inner(name, slug)')
    .neq('status', 'fullført')
    .eq('is_archived', false)
    .eq('board_projects.is_archived', false)
    .order('target_date');
  throwIf(error);
  return (data ?? []) as MilestoneWithProject[];
}

export async function listDocuments(projectId?: string): Promise<BoardDocument[]> {
  let query = supabase.from('board_documents').select('*')
    .order('meeting_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });
  if (projectId) query = query.eq('project_id', projectId);
  const { data, error } = await query;
  throwIf(error);
  return data ?? [];
}

export async function getDocumentUrl(filePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('board-docs').createSignedUrl(filePath, 300);
  throwIf(error);
  return data!.signedUrl;
}

// «Siden sist» — kalles med last_seen_at LEST FØR touchLastSeen (spec, justering B).
export async function getSinceLast(since: string | null): Promise<SinceLast> {
  if (!since) return { newProjects: [], changedMilestones: [], newDocuments: [] };
  const [projects, milestones, documents] = await Promise.all([
    supabase.from('board_projects').select('*')
      .gt('created_at', since).eq('is_archived', false),
    supabase.from('board_milestones')
      .select('*, board_projects!inner(name, slug)')
      .gt('updated_at', since).eq('is_archived', false).eq('board_projects.is_archived', false),
    supabase.from('board_documents').select('*').gt('created_at', since),
  ]);
  throwIf(projects.error);
  throwIf(milestones.error);
  throwIf(documents.error);
  return {
    newProjects: projects.data ?? [],
    changedMilestones: (milestones.data ?? []) as MilestoneWithProject[],
    newDocuments: documents.data ?? [],
  };
}

// Global aktivitetsstrøm for forsiden: hendelser på tvers av prosjekter,
// milepæler og dokumenter siden `sinceIso`, maks 50 totalt.
export async function getActivity(sinceIso: string): Promise<ActivityItem[]> {
  const [projects, milestones, documents] = await Promise.all([
    supabase.from('board_projects').select('*')
      .gte('created_at', sinceIso)
      .order('created_at', { ascending: false }).limit(50),
    supabase.from('board_milestones')
      .select('*, board_projects!inner(name, slug, is_archived)')
      .eq('is_archived', false)
      .eq('board_projects.is_archived', false)
      .gte('updated_at', sinceIso)
      .order('updated_at', { ascending: false }).limit(50),
    supabase.from('board_documents').select('*')
      .gte('created_at', sinceIso)
      .order('created_at', { ascending: false }).limit(50),
  ]);
  throwIf(projects.error);
  throwIf(milestones.error);
  throwIf(documents.error);

  const items: ActivityItem[] = [
    ...(projects.data ?? []).map((p: BoardProject): ActivityItem => ({
      kind: 'prosjekt',
      label: p.name,
      projectName: p.name,
      projectSlug: p.slug,
      timestamp: p.created_at,
    })),
    ...(milestones.data ?? []).map((m: BoardMilestone & { board_projects: { name: string; slug: string } }): ActivityItem => ({
      kind: 'milepæl',
      label: m.title,
      projectName: m.board_projects.name,
      projectSlug: m.board_projects.slug,
      timestamp: m.updated_at,
    })),
    ...(documents.data ?? []).map((d: BoardDocument): ActivityItem => ({
      kind: 'dokument',
      label: d.title,
      projectName: null,
      projectSlug: null,
      timestamp: d.created_at,
    })),
  ];

  return items
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 50);
}

// ── Admin-skriving (RLS håndhever is_board_admin) ──────────

export async function saveProject(
  p: Partial<BoardProject> & { name: string; slug: string },
): Promise<void> {
  const { error } = await supabase.from('board_projects')
    .upsert(p, { onConflict: 'id' });
  throwIf(error);
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from('board_projects').delete().eq('id', id);
  throwIf(error);
}

export async function saveMilestone(m: {
  id?: string; project_id: string; title: string;
  target_date: string; status: MilestoneStatus;
}): Promise<BoardMilestone> {
  const { data, error } = await supabase.from('board_milestones')
    .upsert(m, { onConflict: 'id' })
    .select()
    .single();
  throwIf(error);
  return data as BoardMilestone;
}

export async function deleteMilestone(id: string): Promise<void> {
  const { error } = await supabase.from('board_milestones')
    .delete().eq('id', id);
  throwIf(error);
}

export async function setMilestoneArchived(id: string, archived: boolean): Promise<void> {
  const { error } = await supabase.from('board_milestones')
    .update({ is_archived: archived }).eq('id', id);
  throwIf(error);
}

export async function uploadDocument(file: File, meta: {
  title: string; doc_type: BoardDocument['doc_type'];
  meeting_date: string | null; project_id: string | null;
}): Promise<void> {
  if (file.type !== 'application/pdf') {
    throw new Error('Kun PDF-filer kan lastes opp.');
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${crypto.randomUUID()}/${safeName}`;
  const { error: uploadError } = await supabase.storage
    .from('board-docs')
    .upload(filePath, file, { contentType: 'application/pdf' });
  throwIf(uploadError);
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from('board_documents').insert({
    ...meta, file_path: filePath, uploaded_by: user?.id ?? null,
  });
  if (error) {
    await supabase.storage.from('board-docs').remove([filePath]);
    throw new Error(error.message);
  }
}

const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];

export async function uploadProjectLogo(file: File): Promise<string> {
  if (!LOGO_TYPES.includes(file.type)) {
    throw new Error('Logo må være PNG, JPEG, SVG eller WebP.');
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${crypto.randomUUID()}/${safeName}`;
  const { error } = await supabase.storage
    .from('board-logos')
    .upload(filePath, file, { contentType: file.type });
  throwIf(error);
  return supabase.storage.from('board-logos').getPublicUrl(filePath).data.publicUrl;
}

export async function removeProjectLogoFile(logoUrl: string): Promise<void> {
  const marker = '/board-logos/';
  const idx = logoUrl.indexOf(marker);
  if (idx === -1) return;
  const path = decodeURIComponent(logoUrl.slice(idx + marker.length));
  await supabase.storage.from('board-logos').remove([path]);
}

export async function deleteDocument(doc: BoardDocument): Promise<void> {
  const { error } = await supabase.from('board_documents').delete().eq('id', doc.id);
  throwIf(error);
  await supabase.storage.from('board-docs').remove([doc.file_path]);
}

export async function listMembers(): Promise<BoardMember[]> {
  const { data, error } = await supabase.from('board_members')
    .select('*').order('full_name');
  throwIf(error);
  return data ?? [];
}

export async function addMember(
  email: string, fullName: string, role: BoardMember['role'],
): Promise<void> {
  const { error } = await supabase.from('board_members')
    .insert({ email: email.trim().toLowerCase(), full_name: fullName, role });
  throwIf(error);
}

export async function removeMember(id: string): Promise<void> {
  const { error } = await supabase.from('board_members').delete().eq('id', id);
  throwIf(error);
}
