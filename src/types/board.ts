export interface BoardMember {
  id: string;
  user_id: string | null;
  email: string;
  full_name: string;
  role: 'medlem' | 'admin';
  last_seen_at: string | null;
  created_at: string;
}

export interface BoardProject {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ownership_pct: number | null;
  ownership_note: string | null;
  company_name: string | null;
  company_orgnr: string | null;
  sort_order: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export type MilestoneStatus = 'planlagt' | 'pågår' | 'fullført' | 'forsinket';

export interface BoardMilestone {
  id: string;
  project_id: string;
  title: string;
  target_date: string;
  status: MilestoneStatus;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface MilestoneWithProject extends BoardMilestone {
  board_projects: { name: string; slug: string };
}

export interface BoardDocument {
  id: string;
  project_id: string | null;
  title: string;
  doc_type: 'protokoll' | 'referat' | 'annet';
  meeting_date: string | null;
  file_path: string;
  created_at: string;
}

export interface SinceLast {
  newProjects: BoardProject[];
  changedMilestones: MilestoneWithProject[];
  newDocuments: BoardDocument[];
}
