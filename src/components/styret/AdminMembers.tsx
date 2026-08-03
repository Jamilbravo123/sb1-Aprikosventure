import { useEffect, useState, type FormEvent } from 'react';
import { addMember, listMembers, removeMember } from '../../lib/boardApi';
import type { BoardMember } from '../../types/board';

export default function AdminMembers() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<BoardMember['role']>('medlem');
  const [status, setStatus] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    listMembers().then(setMembers).catch(() => setMembers([]));
  }, [refreshKey]);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);
    try {
      await addMember(email, fullName, role);
      setEmail(''); setFullName(''); setRole('medlem');
      setStatus('Lagt til.');
      setRefreshKey((k) => k + 1);
    } catch (err) {
      const msg = (err as Error).message;
      setStatus(msg.includes('duplicate key')
        ? 'Feil: denne e-posten er allerede registrert.'
        : `Feil: ${msg}`);
    }
  };

  const handleRemove = async (m: BoardMember) => {
    if (!window.confirm(`Fjerne ${m.full_name} fra styret? De mister tilgang umiddelbart.`)) return;
    setStatus(null);
    try {
      await removeMember(m.id);
      setStatus('Fjernet.');
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setStatus(`Feil: ${(err as Error).message}`);
    }
  };

  const field = 'w-full bg-transparent border border-[var(--deck-rule)] p-2 deck-lede';

  return (
    <div className="space-y-8">
      <form onSubmit={handleAdd} className="border border-[var(--deck-rule)] p-6 space-y-4">
        <p className="deck-eyebrow">Legg til medlem</p>
        <div className="grid md:grid-cols-3 gap-4">
          <input className={field} type="email" placeholder="E-post" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={field} placeholder="Fullt navn" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <select className={field} value={role} onChange={(e) => setRole(e.target.value as BoardMember['role'])}>
            <option value="medlem">medlem</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <button type="submit" className="deck-btn-primary">Legg til</button>
        {status && <p className="deck-kicker">{status}</p>}
      </form>

      <ul className="space-y-2">
        {members.map((m) => (
          <li key={m.id} className="flex items-baseline gap-4">
            <span className="deck-lede">{m.full_name}</span>
            <span className="deck-kicker">{m.email} · {m.role}</span>
            <button className="deck-kicker underline ml-auto" style={{ color: '#c94a4a' }}
              onClick={() => handleRemove(m)}>Fjern</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
