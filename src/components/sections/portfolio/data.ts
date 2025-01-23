import { CategoryKey, PortfolioItem } from './types';
import mashwaraLogo from '../../../assets/images/mashwara-ai-logo.webp';
import codeEntropyLogo from '../../../assets/images/code-entropy-logo.webp';
import balderxLogo from '../../../assets/images/balderx-logo.webp';
import venturetokenLogo from '../../../assets/images/hero/browser-icon.svg';

export const portfolioData: Record<CategoryKey, PortfolioItem[]> = {
  'Artificial Intelligence': [
    {
      title: 'Mashwara AI',
      description: 'Supporting patients and doctors with AI-driven solutions that enhance communication, improve healthcare access, and enable informed, efficient decision-making.',
      image: mashwaraLogo,
      status: 'active',
      tags: ['Healthtech', 'AI', 'Healthcare'],
      link: 'https://mashwara.ai/'
    },
    {
      title: 'Code Entropy',
      description: 'Full-stack software house specializing in AI and Web3 solutions.',
      image: codeEntropyLogo,
      status: 'active',
      tags: ['AI', 'Web3', 'Software Development'],
      link: 'https://codentropy.io/'
    }
  ],
  'Distributed Ledger Technology': [
    {
      title: 'Bldrx<sup>2</sup>',
      description: 'Blockchain-powered platform for tokenizing shares and raising capital with secure, transparent, and efficient ownership digitization.',
      image: balderxLogo,
      status: 'development',
      tags: ['Tokenization', 'Capital Markets', 'Blockchain'],
      comingSoon: true
    },
    {
      title: 'ShippingX',
      description: 'Advancing maritime innovation with tokenized assets and sustainable compliance trading.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1600',
      status: 'development',
      tags: ['Maritime', 'Tokenization', 'Sustainability'],
      comingSoon: true
    },
    {
      title: 'Venturetoken (Vt)',
      description: 'Driving innovation in venture ecosystems',
      image: venturetokenLogo,
      status: 'active',
      tags: ['Blockchain', 'DeFi', 'Utility'],
      link: 'https://venturetoken.io/'
    }
  ]
};