export interface DinnerInvite {
  full_name: string;
  email: string | null;
  attending: boolean | null;
  party_size: number | null;
  dietary: string | null;
}

export interface DinnerRsvpInput {
  attending: boolean;
  fullName: string;
  email: string;
  partySize: number;
  dietary: string;
}

export interface DinnerGuest {
  id: string;
  full_name: string;
  email: string | null;
  token: string;
  note: string | null;
  opened_at: string | null;
  created_at: string;
  dinner_rsvps: {
    attending: boolean;
    full_name: string;
    email: string;
    party_size: number;
    dietary: string | null;
    responded_at: string;
    updated_at: string;
  } | null;
}
