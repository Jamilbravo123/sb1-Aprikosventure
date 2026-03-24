import { ventures } from './ventures.mock';
import type { PortfolioCategory } from '../types/dashboard';

export interface CategoryConfig {
  id: PortfolioCategory;
  title: string;
  icon: string;
  description: string;
  ventureIds: string[];
}

export const portfolioCategories: CategoryConfig[] = [
  {
    id: 'digital-assets',
    title: 'Digital Assets',
    icon: '◈',
    description: 'Tokenization, digital payments, and blockchain infrastructure.',
    ventureIds: ['venturetoken', 'nayapaisa', 'shippingx'],
  },
  {
    id: 'health-tech',
    title: 'Health Tech',
    icon: '✦',
    description: 'AI diagnostics, medical devices, and pharmaceutical innovation.',
    ventureIds: ['mashwara-ai', 'aprikos-medical', 'vera-epj', 'pharmesa'],
  },
  {
    id: 'nordic-legacy',
    title: 'Brands',
    icon: '▲',
    description: 'From ventures to everyday life.',
    ventureIds: ['kinetic-energy'],
  },
];

const statusOrder: Record<string, number> = {
  live: 0,
  scaling: 1,
  building: 2,
  stealth: 3,
};

function getStatusPriority(venture: typeof ventures[0]): number {
  const text = venture.statusText?.toLowerCase() || '';
  if (text.includes('launching')) return 1;
  if (text.includes('beta')) return 1;
  return statusOrder[venture.status] ?? 3;
}

export function getVenturesForCategory(categoryId: PortfolioCategory) {
  const category = portfolioCategories.find((c) => c.id === categoryId);
  if (!category) return [];
  return category.ventureIds
    .map((id) => ventures.find((v) => v.id === id))
    .filter(Boolean)
    .sort((a, b) => getStatusPriority(a!) - getStatusPriority(b!));
}
