import type { Venture, TeamMember } from '../types/dashboard';
import mashwaraLogo from '../assets/images/mashwara-ai-logo.png';
const mashwara3dLogo = '/social/mashwara-ai-logo-Cp2Bf_rL.webp';
const shippingxLogo = '/social/shippingx-logo3-trimmed.png';
import aprikosVentureLogo from '../assets/images/aprikos-venture-logo.svg';
import aprikosMedicalLogo from '../assets/images/aprikosmedical-logo.png';
import codeEntropyLogo from '../assets/images/code-entropy-logo.webp';
import venturetokenLogo from '../assets/images/venturetoken-logo.svg';
const venturetoken3dIcon = '/social/venturetoken-3dicon.png';
import balderxLogo from '../assets/images/balderx-logo.png';

// =============================================================================
// VENTURES - Our Venture Structure
// =============================================================================

export const ventures: Venture[] = [
  // PLATFORM: Nordic Legacy
  {
    id: 'nordic-legacy',
    name: 'Nordic Legacy',
    tagline: 'Strategic holding platform for non-tech ventures',
    kind: 'platform',
    industry: 'industry',
    hqCountry: 'NO',
    markets: ['NORDICS'],
    status: 'live',
    ownershipType: 'core',
    aprikosRole: 'Platform Owner',
    logo: aprikosVentureLogo,
    childIds: ['soe-construction', 'november-property', 'aprikos-medical'],
    links: [
      { label: 'Website', url: 'https://nordiclegacy.no', type: 'website' }
    ],
    details: {
      highlights: ['Real estate portfolio', 'Healthcare services', 'Nordic focus']
    }
  },
  
  // Sub-venture: SOE Construction Group (under Nordic Legacy)
  {
    id: 'soe-construction',
    name: 'SOE Construction Group',
    tagline: 'Engineering and construction excellence',
    kind: 'venture',
    industry: 'proptech',
    hqCountry: 'NO',
    markets: ['NO', 'NORDICS'],
    status: 'live',
    ownershipType: 'majority',
    aprikosRole: 'Venture Builder · Operating Partner',
    logo: aprikosVentureLogo,
    parentId: 'nordic-legacy',
    details: {
      highlights: ['Construction', 'Engineering', 'Nordic projects']
    }
  },
  
  // Sub-venture: November Property (under Nordic Legacy)
  {
    id: 'november-property',
    name: 'November Property',
    tagline: 'Property development and real estate',
    kind: 'venture',
    industry: 'proptech',
    hqCountry: 'NO',
    markets: ['NO', 'NORDICS'],
    status: 'live',
    ownershipType: 'majority',
    aprikosRole: 'Venture Builder · Operating Partner',
    logo: '/social/November-Property-Logo-white.png',
    parentId: 'nordic-legacy',
    links: [
      { label: 'Website', url: 'https://novemberproperty.com/', type: 'website' as const }
    ],
    details: {
      highlights: ['Property development', 'Real estate', 'Nordic focus']
    }
  },
  
  // Sub-venture: Aprikos Medical (under Nordic Legacy)
  {
    id: 'aprikos-medical',
    name: 'Aprikos Medical',
    tagline: 'MDR-certified Norwegian medical device manufacturer',
    kind: 'venture',
    industry: 'medtech',
    hqCountry: 'NO',
    markets: ['NO', 'EU', 'GLOBAL'],
    status: 'live',
    ownershipType: 'strategic',
    aprikosRole: 'Venture Builder · Strategic Stake',
    logo: aprikosMedicalLogo,
    parentId: 'nordic-legacy',
    links: [
      { label: 'Website', url: 'https://aprikosmedical.com', type: 'website' }
    ],
    details: {
      highlights: ['Medical devices', 'MDR certified', 'Global distribution']
    }
  },
  
  // VENTURE: Mashwara AI
  {
    id: 'mashwara-ai',
    name: 'Mashwara AI',
    tagline: 'AI-driven healthcare solutions for emerging markets',
    kind: 'venture',
    industry: 'healthtech',
    hqCountry: 'PK',
    markets: ['PK', 'MENA'],
    status: 'building',
    ownershipType: 'core',
    aprikosRole: 'Venture Builder',
    logo: '/social/mashwara_bot.png',
    links: [
      { label: 'Website', url: 'https://mashwara.ai', type: 'website' }
    ],
    balderxUrl: 'https://balderx.com/projects/mashwara-ai',
    statusText: 'Live Beta',
    details: {
      highlights: ['AI/ML platform', 'Healthcare communication', 'Emerging markets']
    }
  },
  
  // VENTURE: ShippingX
  {
    id: 'shippingx',
    name: 'ShippingX',
    tagline: 'Tokenized maritime assets and compliance trading',
    kind: 'venture',
    industry: 'fintech',
    hqCountry: 'NO',
    markets: ['GLOBAL'],
    status: 'building',
    ownershipType: 'strategic',
    aprikosRole: 'Venture Builder',
    logo: shippingxLogo,
    balderxUrl: 'https://balderx.com/projects/shippingx',
    statusText: 'Launching Q1 2026',
    details: {
      highlights: ['Maritime innovation', 'Tokenized assets', 'Sustainable compliance']
    }
  },
  
  // VENTURE: Venturetoken
  {
    id: 'venturetoken',
    name: 'Venturetoken',
    tagline: "Norway's first MiCA registered utility token",
    kind: 'venture',
    industry: 'web3',
    hqCountry: 'NO',
    markets: ['EU', 'GLOBAL'],
    status: 'live',
    ownershipType: 'core',
    aprikosRole: 'Venture Builder · Operating Partner',
    logo: venturetoken3dIcon,
    links: [
      { label: 'Website', url: 'https://venturetoken.io', type: 'website' }
    ],
    balderxUrl: 'https://balderx.com/projects/venturetoken',
    details: {
      highlights: ['MiCA registered', 'Utility token', 'Venture ecosystem']
    }
  },
  
  // VENTURE: BalderX
  {
    id: 'balderx',
    name: 'BalderX',
    tagline: 'Tokenized investment platform for alternative assets',
    kind: 'venture',
    industry: 'fintech',
    hqCountry: 'NO',
    markets: ['EU', 'GLOBAL'],
    status: 'live',
    ownershipType: 'majority',
    aprikosRole: 'Venture Builder · Operating Partner',
    logo: balderxLogo,
    links: [
      { label: 'Platform', url: 'https://balderx.com', type: 'website' }
    ],
    details: {
      highlights: ['Tokenized investments', 'Alternative assets', 'Regulated platform']
    }
  },
  
  // VENTURE: Nayapaisa
  {
    id: 'nayapaisa',
    name: 'Nayapaisa',
    tagline: 'Centralized exchange (under dev.)',
    kind: 'venture',
    industry: 'fintech',
    hqCountry: 'PK',
    markets: ['PK', 'NO'],
    status: 'building',
    ownershipType: 'core',
    aprikosRole: 'Venture Builder',
    logo: '/social/Nayapaisa.png',
    links: [],
    jvPartner: { name: 'NBX', url: 'https://nbx.com', logo: '/social/nbx-logo.svg' },
    details: { highlights: ['Cross-border payments', 'Nordic-South Asian corridor'] },
  },

  // VENTURE: Vera EPJ
  {
    id: 'vera-epj',
    name: 'Vera EPJ',
    tagline: 'AI-assisted electronic patient journal for the Nordic market',
    kind: 'venture',
    industry: 'healthtech',
    hqCountry: 'NO',
    markets: ['NO'],
    status: 'building',
    ownershipType: 'core',
    aprikosRole: 'Venture Builder',
    logo: '/social/veraepj-logo-placeholder.svg',
    links: [
      { label: 'App', url: 'https://app.veraepj.no', type: 'website' as const },
      { label: 'Portal', url: 'https://portal.veraepj.no', type: 'website' as const },
    ],
    statusText: 'Soft Launch',
    details: {
      highlights: ['Electronic patient journal', 'AI-assisted documentation', 'Norwegian compliance']
    }
  },

  // VENTURE: Pharmesa
  {
    id: 'pharmesa',
    name: 'Pharmesa',
    tagline: 'Pharmaceutical launch platform MENA-SA',
    kind: 'venture',
    industry: 'medtech',
    hqCountry: 'NO',
    markets: ['NO', 'EU'],
    status: 'building',
    ownershipType: 'core',
    aprikosRole: 'Venture Builder',
    logo: '',
    links: [],
    jvPartner: { name: 'Pharma Nordic', url: 'https://pharmanordic.no', logo: '/social/pharma-nordic-logo.png' },
    details: { highlights: ['Pharma innovation', 'European markets'] },
  },

  // VENTURE: Kinetic Energy
  {
    id: 'kinetic-energy',
    name: 'Kinetic Energy',
    tagline: 'Performance energy drink powered by Venturetoken',
    kind: 'venture' as VentureKind,
    industry: 'industry' as Industry,
    hqCountry: 'PK' as Country,
    markets: ['NO', 'GLOBAL'] as Market[],
    status: 'building' as VentureStatus,
    statusText: 'Pre-launch',
    ownershipType: 'core' as OwnershipType,
    aprikosRole: 'Venture Builder',
    logo: '/social/ke-logo.png',
    links: [
      { label: 'Website', url: 'https://venturetoken.io/kinetic', type: 'website' as const }
    ],
    scriptTagline: 'on a lighter note',
    flavor: 'Kiwi · Lime',
    launchDate: 'October 2026',
    details: { highlights: ['Energy drink', 'Consumer brand', 'Venturetoken rewards'] },
  },

  // HUB: Code Entropy
  {
    id: 'code-entropy',
    name: 'Code Entropy',
    tagline: 'Our production hub for AI and Web3 development',
    kind: 'hub',
    industry: 'software',
    hqCountry: 'PK',
    markets: ['GLOBAL'],
    status: 'live',
    ownershipType: 'in-house',
    aprikosRole: 'Venture Builder · Operating Partner',
    logo: codeEntropyLogo,
    links: [
      { label: 'Website', url: 'https://codentropy.io', type: 'website' }
    ],
    details: {
      highlights: ['Full-stack development', 'AI/ML capabilities', 'Web3 solutions']
    }
  },
];

// =============================================================================
// CORE TEAM (for "Core Functions" section)
// =============================================================================

export const coreTeam: TeamMember[] = [
  {
    id: 'robert',
    name: 'Robert Lyngmoe',
    role: 'Finance & Operations',
    department: 'core',
    country: 'NO',
  },
  {
    id: 'sara',
    name: 'Sara Rana',
    role: 'Marketing & Growth',
    department: 'core',
    country: 'NO',
  },
];

// =============================================================================
// HELPERS
// =============================================================================

export const getVenturesByCountry = (country: 'NO' | 'PK' | 'ALL') => {
  if (country === 'ALL') return ventures.filter(v => !v.parentId); // Top-level only
  return ventures.filter(v => v.hqCountry === country && !v.parentId);
};

export const getChildVentures = (parentId: string) => {
  return ventures.filter(v => v.parentId === parentId);
};

export const getTopLevelVentures = () => {
  return ventures.filter(v => !v.parentId);
};
