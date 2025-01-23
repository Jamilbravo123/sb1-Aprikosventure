import { PortfolioCompany } from '../types';

export const companies: PortfolioCompany[] = [
  {
    id: 'aprikos-medical',
    name: 'Aprikos Medical',
    description: 'Innovative medical technology solutions revolutionizing patient care through AI-driven diagnostics.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1600',
    status: 'active',
    tags: ['MedTech', 'Healthcare', 'AI']
  },
  {
    id: 'mashwara-ai',
    name: 'Mashwara.ai',
    description: 'Enterprise-grade analytics platform leveraging machine learning for predictive business insights.',
    image: 'https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?auto=format&fit=crop&q=80&w=1600',
    status: 'active',
    tags: ['AI', 'Analytics']
  },
  {
    id: 'code-entropy',
    name: 'Code Entropy',
    description: 'Next-generation software development platform automating code optimization and security.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1600',
    status: 'development',
    tags: ['DevTools', 'AI', 'Security']
  },
  {
    id: 'shippingx',
    name: 'ShippingX',
    description: 'AI-powered logistics platform revolutionizing global supply chain management.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1600',
    status: 'active',
    tags: ['Logistics', 'AI', 'Supply Chain']
  },
  {
    id: 'balderx-protocol',
    name: 'BalderX Protocol',
    description: 'Next-generation DeFi protocol enabling seamless cross-chain transactions and liquidity.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1600',
    status: 'development',
    tags: ['DeFi', 'Blockchain']
  },
  {
    id: 'nordic-legacy',
    name: 'Nordic Legacy',
    description: 'Digital transformation platform revolutionizing the Nordic construction industry.',
    image: 'https://images.unsplash.com/photo-1590986514371-d1a1429199d0?auto=format&fit=crop&q=80&w=1600',
    status: 'active',
    tags: ['PropTech', 'Construction']
  },
  {
    id: 'venturetoken',
    name: 'Venturetoken.io (Vt)',
    description: 'Innovative blockchain venture platform.',
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=1600',
    status: 'active',
    url: 'www.venturetoken.io',
    tags: ['Blockchain', 'DeFi']
  }
];