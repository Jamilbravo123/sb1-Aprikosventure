import { CategoryKey, PortfolioItem } from './types';
import mashwaraLogo from '../../../assets/images/mashwara-ai-logo.webp';
import codeEntropyLogo from '../../../assets/images/code-entropy-logo.webp';
import balderxLogo from '../../../assets/images/balderx-logo.webp';
import aprikosMedicalLogo from '../../../assets/images/aprikosmedical-logo.png';
import juniAiLogo from '../../../assets/images/hero/Juniai - Color logo - no background.png';
import shippingxLogo from '../../../assets/images/hero/Shipping-X1.png';

export const portfolioData: Record<CategoryKey, PortfolioItem[]> = {
  'Health Intelligence': [
    {
      title: 'Mashwara AI',
      description: 'Supporting patients and doctors with AI-driven solutions that enhance communication, improve healthcare access, and enable informed, efficient decision-making.',
      image: mashwaraLogo,
      status: 'active',
      tags: ['Healthtech', 'AI', 'Healthcare'],
      link: 'https://mashwara.ai/',
      isLogo: true
    },
    {
      title: 'Aprikos Medical AS',
      description: 'Aprikos Medical is a Norwegian company that specializes in providing premium medical devices to hospitals and clinics worldwide.',
      image: aprikosMedicalLogo,
      status: 'active',
      tags: ['Medical Devices', 'Healthcare', 'Global'],
      link: 'https://aprikosmedical.com',
      isLogo: true
    },
    {
      title: 'Juni AI',
      description: 'Rethinking clinic intelligence with next-gen AI tools to streamline operations, enhance workflows, and unlock new possibilities for healthcare providers.',
      image: juniAiLogo,
      status: 'development',
      tags: ['Healthcare', 'AI', 'Operations'],
      comingSoon: true,
      isLogo: true
    }
  ],
  'Web3 & Software Innovation': [
    {
      title: 'Code Entropy',
      description: 'Full-stack software house specializing in AI and Web3 solutions.',
      image: codeEntropyLogo,
      status: 'active',
      tags: ['AI', 'Web3', 'Software Development'],
      link: 'https://codentropy.io/',
      isLogo: true
    },
    {
      title: 'Venturetoken (Vt)',
      description: 'Driving innovation in venture ecosystems',
      image: 'https://raw.githubusercontent.com/Jamilbravo123/sb1-Aprikosventure/main/src/assets/images/hero/browser-icon.svg',
      status: 'active',
      tags: ['Blockchain', 'DeFi', 'Utility'],
      link: 'https://venturetoken.io/'
    },
    {
      title: 'BalderX Research',
      description: 'Blockchain-powered platform for tokenizing alternative assets',
      image: balderxLogo,
      status: 'development',
      tags: ['Tokenization', 'Alternative Assets', 'Blockchain'],
      comingSoon: true,
      isLogo: true
    },
    {
      title: 'ShippingX',
      description: 'Advancing maritime innovation with tokenized assets and sustainable compliance trading.',
      image: shippingxLogo,
      status: 'development',
      tags: ['Maritime', 'Tokenization', 'Sustainability'],
      comingSoon: true,
      isLogo: true
    }
  ]
};