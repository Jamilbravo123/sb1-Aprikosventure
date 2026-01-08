import { PortfolioItem } from './types';
import mashwaraLogo from '../../../assets/images/mashwara-ai-logo.webp';
import aprikosMedicalLogo from '../../../assets/images/aprikosmedical-logo.png';
import shippingxLogo from '../../../assets/images/hero/Shipping-X1.png';
import codeEntropyLogo from '../../../assets/images/code-entropy-logo.webp';

// Unified portfolio - selected companies
export const portfolioData: PortfolioItem[] = [
  {
    title: 'Mashwara AI',
    description: 'Supporting patients and doctors with AI-driven solutions that enhance communication, improve healthcare access, and enable informed, efficient decision-making.',
    image: mashwaraLogo,
    status: 'active',
    statusText: 'Live Beta',
    tags: ['Healthtech', 'AI', 'Healthcare'],
    link: 'https://mashwara.ai/',
    isLogo: true
  },
  {
    title: 'Venturetoken (Vt)',
    description: 'Driving innovation in venture ecosystems with Norways first MiCA registered utility token.',
    image: 'https://raw.githubusercontent.com/Jamilbravo123/sb1-Aprikosventure/main/src/assets/images/hero/browser-icon.svg',
    status: 'active',
    tags: ['Blockchain', 'DeFi', 'Utility'],
    link: 'https://venturetoken.io/'
  },
  {
    title: 'ShippingX',
    description: 'Advancing maritime innovation with tokenized assets and sustainable compliance trading.',
    image: shippingxLogo,
    status: 'development',
    statusText: 'Launching Q1 2026',
    tags: ['Maritime', 'Tokenization', 'Sustainability'],
    comingSoon: true,
    isLogo: true
  },
  {
    title: 'Aprikos Medical',
    description: 'Aprikos Medical is a MDR - certified Norwegian medical device manufacturer that specializes in providing premium medical devices to the global market.',
    image: aprikosMedicalLogo,
    status: 'active',
    tags: ['Medical Devices', 'Healthcare', 'Global'],
    link: 'https://aprikosmedical.com',
    isLogo: true
  },
  {
    title: 'Code Entropy',
    description: 'Full-stack software house specializing in AI and Web3 solutions.',
    image: codeEntropyLogo,
    status: 'active',
    tags: ['AI', 'Web3', 'Software Development'],
    link: 'https://codentropy.io/',
    isLogo: true
  }
];