import { useEffect, useState, type FormEvent } from 'react';
import { addGuest, inviteUrl, listGuests, removeGuest } from '../../lib/dinnerApi';
import type { DinnerGuest } from '../../types/dinner';

function guestStatus(g: DinnerGuest): string {
  const r = g.dinner_rsvps;
  if (r) return r.attending ? `Kommer${r.party_size > 1 ? ` (${r.party_size})` : ''}` : 'Kommer ikke';
  return g.opened_at ? 'Åpnet, ikke svart' : 'Ikke åpnet';
}

export default function AdminDinner() {
  const [guests, setGuests] = useState<DinnerGuest[]>([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    listGuests().then(setGuests).catch((err) => setStatus(`Feil: ${(err as Error).message}`));
  }, [refreshKey]);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);
    try {
      await addGuest(fullName, email, note);
      setFullName(''); setEmail(''); setNote('');
      setStatus('Gjest lagt til. Kopier lenken og send den personlig.');
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setStatus(`Feil: ${(err as Error).message}`);
    }
  };

  const handleCopy = async (g: DinnerGuest) => {
    const url = inviteUrl(g.token);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(g.id);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      window.prompt('Kopier lenken:', url);
    }
  };

  const handleRemove = async (g: DinnerGuest) => {
    if (!window.confirm(`Fjerne ${g.full_name}? Lenken slutter å virke, og et eventuelt svar slettes.`)) return;
    try {
      await removeGuest(g.id);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setStatus(`Feil: ${(err as Error).message}`);
    }
  };

  const coming = guests.filter((g) => g.dinner_rsvps?.attending);
  const seats = coming.reduce((n, g) => n + (g.dinner_rsvps?.party_size ?? 1), 0);
  const declined = guests.filter((g) => g.dinner_rsvps && !g.dinner_rsvps.attending).length;
  const waiting = guests.length - coming.length - declined;
  const dietary = coming.filter((g) => g.dinner_rsvps?.dietary);

  const field = 'w-full bg-transparent border border-[var(--deck-rule)] p-2 deck-lede';

  return (
    <div className="space-y-8">
      <div>
        <p className="deck-eyebrow">Investormiddag · torsdag 5. november kl. 18.00</p>
        <p className="deck-lede mt-2">
          {seats} plasser bekreftet · {declined} har takket nei · {waiting} venter på svar · {guests.length} invitert
        </p>
      </div>

      <form onSubmit={handleAdd} className="border border-[var(--deck-rule)] p-6 space-y-4">
        <p className="deck-eyebrow">Legg til gjest</p>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="deck-kicker block mb-1" htmlFor="gjest-navn">Fullt navn</label>
            <input id="gjest-navn" className={field} required value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <label className="deck-kicker block mb-1" htmlFor="gjest-epost">E-post (valgfritt)</label>
            <input id="gjest-epost" className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="deck-kicker block mb-1" htmlFor="gjest-notat">Notat (kun for deg)</label>
            <input id="gjest-notat" className={field} value={note} onChange={(e) => setNote(e.target.value)} placeholder="F.eks. eksisterende investor" />
          </div>
        </div>
        <button type="submit" className="deck-btn-primary">Legg til</button>
        {status && <p className="deck-kicker">{status}</p>}
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left deck-lede">
          <thead>
            <tr className="deck-kicker">
              <th className="py-2 pr-4">Gjest</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Allergier</th>
              <th className="py-2 pr-4">Lenke</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {guests.map((g) => (
              <tr key={g.id} className="border-t border-[var(--deck-rule)] align-top">
                <td className="py-3 pr-4">
                  {g.dinner_rsvps?.full_name ?? g.full_name}
                  {g.note && <span className="block deck-kicker">{g.note}</span>}
                </td>
                <td className="py-3 pr-4">{guestStatus(g)}</td>
                <td className="py-3 pr-4">{g.dinner_rsvps?.dietary ?? '–'}</td>
                <td className="py-3 pr-4">
                  <button type="button" className="deck-kicker underline" onClick={() => handleCopy(g)}>
                    {copied === g.id ? 'Kopiert' : 'Kopier lenke'}
                  </button>
                </td>
                <td className="py-3">
                  <button type="button" className="deck-kicker underline" onClick={() => handleRemove(g)}>Fjern</button>
                </td>
              </tr>
            ))}
            {guests.length === 0 && (
              <tr><td colSpan={5} className="py-6 deck-kicker">Ingen gjester ennå. Legg til den første over.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {dietary.length > 0 && (
        <div className="border border-[var(--deck-rule)] p-6">
          <p className="deck-eyebrow mb-2">Til cateringen</p>
          <ul className="deck-lede space-y-1">
            {dietary.map((g) => <li key={g.id}>{g.dinner_rsvps?.full_name}: {g.dinner_rsvps?.dietary}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
