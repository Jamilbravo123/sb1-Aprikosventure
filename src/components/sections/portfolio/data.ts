import { CategoryKey, PortfolioItem } from './types';

export const portfolioData: Record<CategoryKey, PortfolioItem[]> = {
  'AI': [
    {
      title: 'Mashwara AI',
      description: 'Enterprise-grade analytics platform leveraging machine learning for predictive insights and decision automation.',
      image: 'https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?auto=format&fit=crop&q=80&w=1600',
      status: 'active',
      tags: ['Machine Learning', 'Analytics', 'Enterprise'],
      link: 'https://mashwara.ai/'
    },
    {
      title: 'Code Entropy',
      description: 'Advanced natural language processing tools for automated content analysis and generation.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1600',
      status: 'development',
      tags: ['NLP', 'Content Analysis', 'AI'],
      link: 'https://codentropy.io/'
    }
  ],
  'DLT': [
    {
      title: 'DeFi Protocol',
      description: 'Next-generation decentralized finance protocol enabling seamless cross-chain transactions.',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1600',
      status: 'development',
      tags: ['DeFi', 'Blockchain', 'Finance']
    },
    {
      title: 'Blockchain Identity',
      description: 'Decentralized identity solution for secure and private digital credentials.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1600',
      status: 'active',
      tags: ['Identity', 'Security', 'Blockchain']
    }
  ]
};