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
    description: 'AI diagnostics, medical devices, and culturally adapted care.',
    ventureIds: ['mashwara-ai', 'aprikos-medical', 'mkv32-cultural-care', 'pharmesa'],
  },
];

export function getVenturesForCategory(categoryId: PortfolioCategory) {
  const category = portfolioCategories.find((c) => c.id === categoryId);
  if (!category) return [];
  return category.ventureIds
    .map((id) => ventures.find((v) => v.id === id))
    .filter(Boolean);
}
