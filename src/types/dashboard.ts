// =============================================================================
// ORGANIZATION TYPES - Venture Structure
// Following DRY principle - all types centralized here
// =============================================================================

// Venture categories
export type VentureKind = 'venture' | 'platform' | 'hub';

// Industry/Sector for badge display
export type Industry = 'healthtech' | 'fintech' | 'web3' | 'maritime' | 'proptech' | 'medtech' | 'software' | 'industry';

// Ownership display (kun i modal - NO percentages on cards)
export type OwnershipType = 'core' | 'majority' | 'strategic' | 'in-house';

// Status (konsistent, 4 valg)
export type VentureStatus = 'live' | 'building' | 'scaling' | 'stealth';

export type PortfolioCategory = 'digital-assets' | 'health-tech' | 'nordic-legacy';

// Aprikos rolle - 4 intuitive kategorier (kan kombineres med ·)
export type AprikosRole = 
  | 'Venture Builder' 
  | 'Operating Partner' 
  | 'Platform Owner' 
  | 'Strategic Stake'
  | 'Venture Builder · Operating Partner'
  | 'Venture Builder · Strategic Stake';

// Geography
export type Country = 'NO' | 'PK' | 'AE' | 'DE' | 'UK' | 'US';
export type Market = 'NO' | 'PK' | 'MENA' | 'EU' | 'GLOBAL' | 'NORDICS';

// =============================================================================
// VENTURE INTERFACE
// =============================================================================

export interface Venture {
  id: string;
  name: string;
  tagline: string;              // 1 linje - hva det er
  kind: VentureKind;            // venture | platform | hub
  industry: Industry;           // For badge display on cards
  
  // Geography (separate HQ fra markets)
  hqCountry: Country;
  markets?: Market[];
  
  // Status & ownership (kun i modal - NO % on cards)
  status: VentureStatus;
  ownershipType: OwnershipType;
  aprikosRole: AprikosRole;
  
  // Visual
  logo?: string;
  
  // Hierarchy
  parentId?: string;            // For sub-ventures (November, Aprikos Medical)
  childIds?: string[];          // For platforms (Nordic Legacy)
  
  // Portfolio
  category?: PortfolioCategory;
  statusText?: string;

  // Links
  links?: VentureLink[];
  balderxUrl?: string;

  // Joint venture partner (shown on venture card for credibility)
  jvPartner?: JvPartner;

  // Brand tagline rendered in a script font on the venture card (optional flourish)
  scriptTagline?: string;

  // Product flavor shown as a small chip on the venture card (consumer brands)
  flavor?: string;

  // Sensitive details (kun i modal accordion)
  details?: VentureDetails;
}

export interface JvPartner {
  name: string;
  url: string;
  logo?: string;
}

export interface VentureDetails {
  ownershipPercent?: number;    // Kun i modal, bak accordion
  foundedYear?: number;
  teamSize?: number;
  notes?: string;
  highlights?: string[];
}

export interface VentureLink {
  label: string;
  url: string;
  type: 'website' | 'linkedin' | 'docs' | 'demo';
}

// =============================================================================
// TEAM
// =============================================================================

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'core' | 'ventures' | 'production';
  country: Country;
  avatar?: string;
  linkedIn?: string;
}

// =============================================================================
// NEWS (unchanged)
// =============================================================================

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  summary: string;
  url?: string;
}

// =============================================================================
// LABELS (for UI - DRY)
// =============================================================================

export const ownershipLabels: Record<OwnershipType, string> = {
  core: 'Core Venture',
  majority: 'Majority-owned',
  strategic: 'Strategic Stake',
  'in-house': 'In-house Hub'
};

export const statusLabels: Record<VentureStatus, string> = {
  live: 'Live',
  building: 'Building',
  scaling: 'Scaling',
  stealth: 'Stealth'
};

export const kindLabels: Record<VentureKind, string> = {
  venture: 'Venture',
  platform: 'Platform',
  hub: 'Production Hub'
};

export const industryLabels: Record<Industry, string> = {
  healthtech: 'Healthtech',
  fintech: 'Fintech',
  web3: 'Web3',
  maritime: 'Maritime',
  proptech: 'Proptech',
  medtech: 'Medtech',
  software: 'Software',
  industry: 'Industry'
};

export const industryColors: Record<Industry, string> = {
  healthtech: 'bg-emerald-900/30 text-emerald-300 border-emerald-700/30',
  fintech: 'bg-blue-900/30 text-blue-300 border-blue-700/30',
  web3: 'bg-purple-900/30 text-purple-300 border-purple-700/30',
  maritime: 'bg-cyan-900/30 text-cyan-300 border-cyan-700/30',
  proptech: 'bg-amber-900/30 text-amber-300 border-amber-700/30',
  medtech: 'bg-rose-900/30 text-rose-300 border-rose-700/30',
  software: 'bg-indigo-900/30 text-indigo-300 border-indigo-700/30',
  industry: 'bg-slate-700/50 text-slate-300 border-slate-600/30'
};

export const countryFlags: Record<Country, string> = {
  NO: '🇳🇴',
  PK: '🇵🇰',
  AE: '🇦🇪',
  DE: '🇩🇪',
  UK: '🇬🇧',
  US: '🇺🇸'
};

// Status colors for badges
export const statusColors: Record<VentureStatus, string> = {
  live: 'bg-emerald-900/30 text-emerald-300 border-emerald-700/30',
  building: 'bg-blue-900/30 text-blue-300 border-blue-700/30',
  scaling: 'bg-purple-900/30 text-purple-300 border-purple-700/30',
  stealth: 'bg-slate-700/50 text-slate-300 border-slate-600/30'
};

// Ownership colors for badges
export const ownershipColors: Record<OwnershipType, string> = {
  core: 'bg-[#C9935E]/20 text-[#E8C896] border-[#C9935E]/30',
  majority: 'bg-blue-900/30 text-blue-300 border-blue-700/30',
  strategic: 'bg-slate-700/50 text-slate-300 border-slate-600/30',
  'in-house': 'bg-purple-900/30 text-purple-300 border-purple-700/30'
};
