import type { TeamMember } from './types';
import jamilPortrait from '../../../assets/images/hero/jamil-portrett2.png';

export const teamMembers: TeamMember[] = [
  {
    name: 'Jamil Rehman',
    role: 'CEO & Founder',
    image: jamilPortrait,
    bio: 'Serial entrepreneur with 15+ years of experience in technology and venture building.',
    social: {
      linkedin: 'https://www.linkedin.com/in/jamil-rehman-725961222',
      email: 'jamil@aprikosventure.com'
    }
  },
  {
    name: 'Sara Rana',
    role: 'Chief Investment Officer',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1600',
    bio: 'Former VC partner specializing in early-stage investments and portfolio management.',
    social: {
      linkedin: '#',
      email: 'sara@aprikosventure.com'
    }
  },
  {
    name: 'Marcus Berg',
    role: 'Head of Technology',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=1600',
    bio: 'Tech veteran with expertise in blockchain, AI, and enterprise software development.',
    social: {
      linkedin: '#',
      email: 'marcus@aprikosventure.com'
    }
  }
] as const;