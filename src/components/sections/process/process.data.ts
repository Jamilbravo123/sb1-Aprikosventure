import { Search, Lightbulb, Rocket, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ProcessStep {
  icon: LucideIcon;
  title: string;
  description: string;
  number: string;
}

export const processSteps: ProcessStep[] = [
  {
    icon: Search,
    title: 'Discovery',
    description: 'We identify promising opportunities and validate market potential through thorough research and analysis.',
    number: '01',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Developing unique solutions through cutting-edge technology and strategic creativity.',
    number: '02',
  },
  {
    icon: Rocket,
    title: 'Launch',
    description: 'Rapid deployment with continuous testing and data-driven refinement.',
    number: '03',
  },
  {
    icon: TrendingUp,
    title: 'Scale',
    description: 'Growing ventures through strategic partnerships and calculated market expansion.',
    number: '04',
  },
];