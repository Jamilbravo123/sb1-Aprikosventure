export interface VentureOpportunity {
  id: string;
  name: string;
  logo?: string;
  category: string[];
  description: string;
  highlights: {
    stage: string;
    geography: string;
    thesis: string;
  };
  latestUpdate?: {
    date: string;
    text: string;
  };
  fundingInfo?: {
    currentRound: string;
    target: string;
    status: 'open' | 'closed' | 'upcoming';
    minInvestment: string;
  };
  balderxUrl: string;
  infoUrl?: string;
}

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  summary: string;
  url?: string;
}

