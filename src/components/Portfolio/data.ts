import { PortfolioItem } from './types';

export const portfolioData: Record<string, PortfolioItem[]> = {
  'Nordic Legacy': [
    {
      title: 'Nordic Construction',
      description: 'Digital transformation platform revolutionizing the Nordic construction industry through innovative technology solutions.',
      image: 'https://images.unsplash.com/photo-1590986514371-d1a1429199d0?auto=format&fit=crop&q=80&w=1600',
      status: 'active',
    },
    {
      title: 'Green Energy Solutions',
      description: 'Sustainable energy management systems for Nordic industrial applications.',
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1600',
      status: 'development',
    }
  ],
  'DLT': [
    {
      title: 'DeFi Protocol',
      description: 'Next-generation decentralized finance protocol enabling seamless cross-chain transactions and liquidity management.',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1600',
      status: 'development',
    },
    {
      title: 'Blockchain Identity',
      description: 'Decentralized identity solution for secure and private digital credentials.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1600',
      status: 'active',
    }
  ],
  'AI': [
    {
      title: 'AI Analytics Platform',
      description: 'Enterprise-grade analytics platform leveraging machine learning for predictive insights and decision automation.',
      image: 'https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?auto=format&fit=crop&q=80&w=1600',
      status: 'active',
    },
    {
      title: 'NLP Solutions',
      description: 'Advanced natural language processing tools for automated content analysis and generation.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1600',
      status: 'development',
    }
  ],
  'Industry': [
    {
      title: 'Smart Manufacturing',
      description: 'IoT-enabled manufacturing optimization platform for increased efficiency and reduced operational costs.',
      image: 'https://images.unsplash.com/photo-1565465295423-68c959a599ba?auto=format&fit=crop&q=80&w=1600',
      status: 'development',
    },
    {
      title: 'Supply Chain Analytics',
      description: 'End-to-end supply chain visibility and optimization platform using AI and blockchain.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1600',
      status: 'active',
    }
  ]
};