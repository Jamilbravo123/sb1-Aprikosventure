import { Target, Lightbulb, Users, Rocket } from 'lucide-react';
import type { Value } from './types';

export const values: Value[] = [
  {
    icon: Target,
    title: 'Strategic Vision',
    description: 'We identify and nurture transformative ideas that shape the future of technology and business.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation First',
    description: 'Our focus on emerging technologies drives breakthrough solutions across industries.',
  },
  {
    icon: Users,
    title: 'Strong Partnerships',
    description: 'We build lasting relationships with founders, creating value through collaborative growth.',
  },
  {
    icon: Rocket,
    title: 'Rapid Execution',
    description: 'Our proven methodology enables quick validation and efficient scaling of ventures.',
  },
] as const;