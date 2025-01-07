import type { TeamMember } from './types';

export const teamMembers: TeamMember[] = [
  {
    name: 'Erik Hansen',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1600',
    bio: 'Serial entrepreneur with 15+ years of experience in technology and venture building.',
    social: {
      linkedin: '#',
      twitter: '#',
      email: 'erik@aprikos.no'
    }
  },
  {
    name: 'Sofia Larsson',
    role: 'Chief Investment Officer',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1600',
    bio: 'Former VC partner specializing in early-stage investments and portfolio management.',
    social: {
      linkedin: '#',
      email: 'sofia@aprikos.no'
    }
  },
  {
    name: 'Marcus Berg',
    role: 'Head of Technology',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=1600',
    bio: 'Tech veteran with expertise in blockchain, AI, and enterprise software development.',
    social: {
      linkedin: '#',
      twitter: '#',
      email: 'marcus@aprikos.no'
    }
  },
  {
    name: 'Anna Nilsson',
    role: 'Operations Director',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=1600',
    bio: 'Experienced operations leader with a track record of scaling startups.',
    social: {
      linkedin: '#',
      email: 'anna@aprikos.no'
    }
  },
  {
    name: 'Johan Svensson',
    role: 'Investment Manager',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=1600',
    bio: 'Former startup founder with expertise in deal structuring and due diligence.',
    social: {
      linkedin: '#',
      twitter: '#',
      email: 'johan@aprikos.no'
    }
  },
  {
    name: 'Maria Andersson',
    role: 'Head of Partnerships',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=1600',
    bio: 'Strategic partnerships expert focusing on corporate and startup collaborations.',
    social: {
      linkedin: '#',
      email: 'maria@aprikos.no'
    }
  }
] as const;