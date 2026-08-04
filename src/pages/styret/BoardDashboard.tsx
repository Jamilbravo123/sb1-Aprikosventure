import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  getSinceLast, listAllMilestones, listProjects,
  listUpcomingMilestones, touchLastSeen,
} from '../../lib/boardApi';
import type {
  BoardMember, BoardMilestone, BoardProject, MilestoneWithProject, SinceLast,
} from '../../types/board';
import UpcomingMilestones from '../../components/styret/UpcomingMilestones';
import ProjectCard from '../../components/styret/ProjectCard';
import ActivityStream from '../../components/styret/ActivityStream';
import KpiRow from '../../components/styret/KpiRow';

const TOUCH_TERSKEL_MS = 30 * 60 * 1000;

export default function BoardDashboard({ member }: { member: BoardMember }) {
  const { signOut } = useAuth();
  const [sinceLast, setSinceLast] = useState<SinceLast | null>(null);
  const [upcoming, setUpcoming] = useState<MilestoneWithProject[]>([]);
  const [projects, setProjects] = useState<BoardProject[]>([]);
  const [milestonesByProject, setMilestonesByProject] = useState<Record<string, BoardMilestone[]>>({});
  const [showArchived, setShowArchived] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const touched = useRef(false);

  useEffect(() => {
    const load = async () => {
      try {
        // 1) Les «siden sist» fra verdien slik den var ved innlogging …
        const since = await getSinceLast(member.last_seen_at);
        setSinceLast(since);
        // 2) … og oppdater tidsstempelet ETTERPÅ (én gang per økt).
        if (!touched.current) {
          touched.current = true;
          const forrige = member.last_seen_at ? new Date(member.last_seen_at).getTime() : 0;
          // Oppdater «siste besøk» kun ved en NY økt (>30 min siden forrige) — ellers
          // ville hver sidelast nullstille referansepunktet for «Oppdateringer».
          if (Date.now() - forrige > TOUCH_TERSKEL_MS) {
            touchLastSeen(member.id).catch(() => {});
          }
        }
        const [upcomingData, projectData, allMilestones] = await Promise.all([
          listUpcomingMilestones(),
          listProjects(true),
          listAllMilestones(),
        ]);
        setUpcoming(upcomingData);
        setProjects(projectData);
        const byProject = allMilestones.reduce<Record<string, BoardMilestone[]>>((acc, m) => {
          (acc[m.project_id] ??= []).push(m);
          return acc;
        }, {});
        setMilestonesByProject(byProject);
      } catch {
        setError('Kunne ikke laste innholdet. Last siden på nytt.');
      }
    };
    load();
  }, [member.id, member.last_seen_at]);

  const visibleProjects = projects.filter((p) => showArchived || !p.is_archived);
  const activeProjectsCount = projects.filter((p) => !p.is_archived).length;
  const inProgressCount = upcoming.filter((m) => m.status === 'pågår').length;
  const newSinceLastCount = sinceLast
    ? sinceLast.newProjects.length + sinceLast.changedMilestones.length + sinceLast.newDocuments.length
    : 0;

  return (
    <div className="deck-page styret-page min-h-screen px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
        <header className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="deck-eyebrow">Aprikos Venture</p>
            <h1 className="deck-display text-3xl sm:text-4xl mt-2">
              Styre<span className="deck-italic-gold">portal</span>
            </h1>
            <p className="deck-kicker mt-2">Det kommende styret</p>
          </div>
          <nav className="flex gap-4 sm:gap-6 items-baseline flex-wrap">
            <Link to="/styret/dokumenter" className="deck-kicker underline">Dokumenter</Link>
            {member.role === 'admin' && (
              <Link to="/styret/admin" className="deck-kicker underline">Admin</Link>
            )}
            <button className="deck-kicker underline" onClick={() => signOut()}>Logg ut</button>
          </nav>
        </header>

        {error && <p className="deck-lede" style={{ color: '#c94a4a' }}>{error}</p>}
        {!error && sinceLast === null && <p className="deck-kicker">Laster …</p>}

        {sinceLast !== null && (
          <>
            <KpiRow
              activeProjects={activeProjectsCount}
              upcomingCount={upcoming.length}
              nextDeadline={upcoming[0]?.target_date ?? null}
              inProgressCount={inProgressCount}
              newSinceLast={newSinceLastCount}
              lastSeenAt={member.last_seen_at}
            />

            <ActivityStream />

            <section>
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <p className="deck-eyebrow">Prosjekter</p>
                <button className="deck-kicker underline" onClick={() => setShowArchived((v) => !v)}>
                  {showArchived ? 'Skjul arkiverte' : 'Vis arkiverte'}
                </button>
              </div>
              {visibleProjects.length === 0 ? (
                <p className="deck-lede mt-3">Ingen prosjekter ennå.</p>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3.5 mt-4">
                  {visibleProjects.map((p) => (
                    <ProjectCard key={p.id} project={p} milestones={milestonesByProject[p.id] ?? []} />
                  ))}
                </div>
              )}
            </section>

            <UpcomingMilestones items={upcoming} />
          </>
        )}
      </div>
    </div>
  );
}
