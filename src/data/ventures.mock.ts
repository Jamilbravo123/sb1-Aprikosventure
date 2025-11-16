import { VentureOpportunity } from '../types/dashboard';
import mashwaraLogo from '../assets/images/mashwara-ai-logo.webp';
import shippingxLogo from '../assets/images/hero/Shipping-X1.png';
import aprikosVentureLogo from '../assets/images/aprikos-venture-logo.svg';
import aprikosMedicalLogo from '../assets/images/aprikosmedical-logo.png';

export const ventures: VentureOpportunity[] = [
  {
    id: 'mashwara-ai',
    name: 'Mashwara AI',
    logo: mashwaraLogo,
    category: ['Healthtech', 'AI', 'Pakistan'],
    description: 'Supporting patients and doctors with AI-driven solutions that enhance communication, improve healthcare access, and enable informed decision-making.',
    highlights: {
      stage: 'Seed Stage',
      geography: 'Pakistan, Norway',
      thesis: 'Making quality healthcare accessible through AI-powered patient-doctor communication'
    },
    latestUpdate: {
      date: 'November 10, 2025',
      text: 'Successfully closed seed funding round and launched beta platform with 500+ active users'
    },
    fundingInfo: {
      currentRound: 'Seed Round',
      target: '$500,000',
      status: 'open',
      minInvestment: '100 Vt'
    },
    balderxUrl: 'https://balderx.com/projects/mashwara-ai'
  },
  {
    id: 'shippingx',
    name: 'ShippingX',
    logo: shippingxLogo,
    category: ['Maritime', 'Tokenization', 'Sustainability'],
    description: 'Advancing maritime innovation with tokenized assets and sustainable compliance trading for the global shipping industry.',
    highlights: {
      stage: 'Pre-Seed',
      geography: 'Norway, Global',
      thesis: 'Tokenizing maritime assets to unlock liquidity in the $2T shipping industry'
    },
    latestUpdate: {
      date: 'November 5, 2025',
      text: 'Partnered with major Norwegian shipping companies for pilot program'
    },
    fundingInfo: {
      currentRound: 'Pre-Seed Round',
      target: '$250,000',
      status: 'open',
      minInvestment: '100 Vt'
    },
    balderxUrl: 'https://balderx.com/projects/shippingx'
  },
  {
    id: 'aprikos-medical',
    name: 'Aprikos Medical',
    logo: aprikosMedicalLogo,
    category: ['Medical Devices', 'Healthcare', 'Global'],
    description: 'Norwegian medical device manufacturer specializing in premium medical devices for the global market.',
    highlights: {
      stage: 'Active',
      geography: 'Norway, Global',
      thesis: 'Delivering premium medical technology to healthcare providers worldwide'
    },
    latestUpdate: {
      date: 'November 1, 2025',
      text: 'Expanded distribution network to 15 new countries across Europe and Asia'
    },
    fundingInfo: {
      currentRound: 'Growth Round',
      target: '$750,000',
      status: 'open',
      minInvestment: '100 Vt'
    },
    balderxUrl: 'https://balderx.com/projects/aprikos-medical'
  },
  {
    id: 'aprikos-venture-basket',
    name: 'Aprikos Venture Basket',
    logo: aprikosVentureLogo,
    category: ['DeFi', 'Portfolio', 'Tokenization'],
    description: 'Diversified tokenized basket providing exposure to multiple high-growth ventures across the Aprikos Venture portfolio.',
    highlights: {
      stage: 'Active',
      geography: 'Global',
      thesis: 'Democratizing venture capital access through tokenized portfolio exposure'
    },
    latestUpdate: {
      date: 'November 12, 2025',
      text: 'Q4 portfolio update: 35% average growth across portfolio companies'
    },
    fundingInfo: {
      currentRound: 'Continuous',
      target: 'Ongoing',
      status: 'open',
      minInvestment: '100 Vt'
    },
    balderxUrl: 'https://balderx.com/projects/aprikos-basket',
    infoUrl: '#portfolio'
  }
];

