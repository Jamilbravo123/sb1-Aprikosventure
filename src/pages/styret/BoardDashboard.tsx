import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  getSinceLast, listProjects, listProjectMilestones,
  listUpcomingMilestones, touchLastSeen,
} from '../../lib/boardApi';
import type {
  BoardMember, BoardMilestone, BoardProject, MilestoneWithProject, SinceLast,
} from '../../types/board';
import SinceLastPanel from '../../components/styret/SinceLastPanel';
import UpcomingMilestones from '../../components/styret/UpcomingMilestones';
import ProjectCard from '../../components/styret/ProjectCard';

export default function BoardDashboard({ member }: { member: BoardMember }) {
  const { signOut } = useAuth();
  const [sinceLast, setSinceLast] = useState<SinceLast | null>(null);
  const [upcoming, setUpcoming] = useState<MilestoneWithProject[]>([]);
  const [projects, setProjects] = useState<BoardProject[]>([]);
  const [nextByProject, setNextByProject] = useState<Record<string, BoardMilestone | null>>({});
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
          touchLastSeen(member.id).catch(() => {});
        }
        const [upcomingData, projectData] = await Promise.all([
          listUpcomingMilestones(),
          listProjects(true),
        ]);
        setUpcoming(upcomingData);
        setProjects(projectData);
        const next: Record<string, BoardMilestone | null> = {};
        await Promise.all(projectData.map(async (p) => {
          const ms = await listProjectMilestones(p.id);
          const open = ms.filter((m) => m.status !== 'fullført')
            .sort((a, b) => a.target_date.localeCompare(b.target_date));
          next[p.id] = open[0] ?? null;
        }));
        setNextByProject(next);
      } catch {
        setError('Kunne ikke laste innholdet. Last siden på nytt.');
      }
    };
    load();
  }, [member.id, member.last_seen_at]);

  const visibleProjects = projects.filter((p) => showArchived || !p.is_archived);

  return (
    <div className="deck-page min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="deck-eyebrow">Aprikos Venture</p>
            <h1 className="deck-display text-4xl mt-2">
              Styre<span className="deck-italic-gold">portal</span>
            </h1>
            <p className="deck-kicker mt-2">Det kommende styret</p>
          </div>
          <nav className="flex gap-6 items-baseline">
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
            <SinceLastPanel data={sinceLast} firstVisit={member.last_seen_at === null} />
            <UpcomingMilestones items={upcoming} />
            <section>
              <div className="flex items-baseline justify-between">
                <p className="deck-eyebrow">Prosjekter</p>
                <button className="deck-kicker underline" onClick={() => setShowArchived((v) => !v)}>
                  {showArchived ? 'Skjul arkiverte' : 'Vis arkiverte'}
                </button>
              </div>
              {visibleProjects.length === 0 ? (
                <p className="deck-lede mt-3">Ingen prosjekter ennå.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {visibleProjects.map((p) => (
                    <ProjectCard key={p.id} project={p} nextMilestone={nextByProject[p.id] ?? null} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
