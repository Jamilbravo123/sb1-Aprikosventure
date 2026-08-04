import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useBoardMember } from '../../hooks/useBoardMember';
import AdminProjects from '../../components/styret/AdminProjects';
import AdminDocuments from '../../components/styret/AdminDocuments';
import AdminMembers from '../../components/styret/AdminMembers';

const TABS = ['prosjekter', 'dokumenter', 'medlemmer'] as const;
type Tab = (typeof TABS)[number];

export default function BoardAdmin() {
  const { member, loading } = useBoardMember();
  const [tab, setTab] = useState<Tab>('prosjekter');

  if (loading) {
    return <div className="deck-page styret-page min-h-screen flex items-center justify-center"><p className="deck-kicker">Laster …</p></div>;
  }
  if (!member || member.role !== 'admin') return <Navigate to="/styret" replace />;

  return (
    <div className="deck-page styret-page min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link to="/styret" className="deck-kicker underline">← Styreportal</Link>
        <h1 className="deck-display text-4xl">Admin</h1>
        <nav className="flex gap-6">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="deck-kicker"
              style={tab === t ? { color: 'var(--deck-gold)' } : undefined}>
              {t}
            </button>
          ))}
        </nav>
        {tab === 'prosjekter' && <AdminProjects />}
        {tab === 'dokumenter' && <AdminDocuments />}
        {tab === 'medlemmer' && <AdminMembers />}
      </div>
    </div>
  );
}
