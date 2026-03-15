import type { Venture } from '../types/dashboard';
import { ventures } from './ventures.mock';

const portfolioIds = [
  'mashwara-ai',
  'venturetoken',
  'balderx',
  'shippingx',
  'aprikos-medical',
  'code-entropy',
];

export const portfolioVentures: Venture[] = portfolioIds
  .map(id => ventures.find(v => v.id === id))
  .filter((v): v is Venture => v !== null);
