import { supabase } from './supabase';
import type { DinnerGuest, DinnerInvite, DinnerRsvpInput } from '../types/dinner';

function throwIf(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}

// ── Gjest (ikke innlogget, kun via lenkekoden) ─────────────

export async function getInvite(token: string): Promise<DinnerInvite | null> {
  const { data, error } = await supabase.rpc('dinner_get_invite', { p_token: token });
  throwIf(error);
  return (data as DinnerInvite[] | null)?.[0] ?? null;
}

export async function submitRsvp(token: string, input: DinnerRsvpInput): Promise<boolean> {
  const { data, error } = await supabase.rpc('dinner_submit_rsvp', {
    p_token: token,
    p_attending: input.attending,
    p_full_name: input.fullName,
    p_email: input.email,
    p_party_size: input.partySize,
    p_dietary: input.dietary,
  });
  throwIf(error);
  if (data === true) {
    // Varselet til verten er «best effort»: et svar som er lagret, skal ikke se feilet ut for gjesten.
    supabase.functions.invoke('middag-varsel', { body: { token } }).catch(() => undefined);
  }
  return data === true;
}

// ── Admin (styreportalen, RLS: is_board_admin) ─────────────

export async function listGuests(): Promise<DinnerGuest[]> {
  const { data, error } = await supabase.from('dinner_guests')
    .select('id, full_name, email, token, note, opened_at, link_copied_at, created_at, dinner_rsvps(attending, full_name, email, party_size, dietary, responded_at, updated_at)')
    .order('created_at');
  throwIf(error);
  return (data ?? []) as unknown as DinnerGuest[];
}

export async function addGuest(fullName: string, email: string, note: string): Promise<void> {
  const { error } = await supabase.from('dinner_guests').insert({
    full_name: fullName.trim(),
    email: email.trim() ? email.trim().toLowerCase() : null,
    note: note.trim() || null,
  });
  throwIf(error);
}

export async function markLinkCopied(id: string): Promise<string> {
  const copiedAt = new Date().toISOString();
  const { error } = await supabase.from('dinner_guests').update({ link_copied_at: copiedAt }).eq('id', id);
  throwIf(error);
  return copiedAt;
}

export async function removeGuest(id: string): Promise<void> {
  const { error } = await supabase.from('dinner_guests').delete().eq('id', id);
  throwIf(error);
}

export function inviteUrl(token: string): string {
  return `${window.location.origin}/middag/?g=${token}`;
}
