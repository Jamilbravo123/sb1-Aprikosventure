import type { Venture, TeamMember, VentureKind, Industry, Country, Market, VentureStatus, OwnershipType } from '../types/dashboard';
const shippingxLogo = '/social/shippingx-logo3-trimmed.png';
import codeEntropyLogo from '../assets/images/code-entropy-logo.webp';
const venturetoken3dIcon = '/social/venturetoken-3dicon.png';
import balderxLogo from '../assets/images/balderx-logo.png';

// =============================================================================
// VENTURES - Our Venture Structure
// =============================================================================

export const ventures: Venture[] = [
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
    tagline: 'Tokenized maritime debt for professional investors',
    kind: 'venture',
    industry: 'fintech',
    hqCountry: 'DE',
    markets: ['EU', 'GLOBAL'],
    status: 'building',
    ownershipType: 'strategic',
    aprikosRole: 'Venture Builder',
    logo: shippingxLogo,
    balderxUrl: 'https://balderx.com/projects/shippingx',
    statusText: 'First issuance Q3 2026',
    details: {
      highlights: ['Maritime finance', 'Tokenized notes', 'BaFin tied agent via BMCP']
    }
  },
  
  // VENTURE: Venturetoken
  {
    id: 'venturetoken',
    name: 'Venturetoken',
    tagline: "Norway's first MiCA-notified utility token",
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
      highlights: ['MiCA-notified white paper', 'Listed on NBX', 'Proof-of-Engagement rewards']
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
    tagline: 'Regulated digital asset exchange',
    kind: 'venture',
    industry: 'fintech',
    hqCountry: 'NO',
    markets: ['NO'],
    status: 'building',
    ownershipType: 'core',
    aprikosRole: 'Venture Builder',
    logo: '/social/Nayapaisa.png',
    links: [],
    jvPartner: { name: 'NBX', url: 'https://nbx.com', logo: '/social/nbx-logo.svg' },
    statusText: 'LOI signed',
    details: { highlights: ['50/50 joint venture with NBX', 'Letter of intent signed', 'Subject to definitive agreements and regulatory approval'] },
  },

  // VENTURE: Pharmesa
  {
    id: 'pharmesa',
    name: 'Pharmesa',
    tagline: 'Pharmaceutical launch platform MENA-SA',
    kind: 'venture',
    industry: 'medtech',
    hqCountry: 'NO',
    markets: ['NO', 'EU', 'MENA'],
    status: 'building',
    ownershipType: 'core',
    aprikosRole: 'Venture Builder',
    logo: '/social/pharmesa-logo.jpeg',
    links: [],
    jvPartner: { name: 'Pharma Nordic', url: 'https://pharmanordic.no', logo: '/social/pharma-nordic-logo.png' },
    details: { highlights: ['Proponent nasal spray', 'JV with Pharma Nordic', 'Nordic launch, MENA-SA expansion'] },
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
