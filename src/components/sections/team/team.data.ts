import type { TeamMember } from './types';
import jamilPortrait from '../../../assets/images/hero/jamil-portrett2.png';
import saraPortrait from '../../../assets/images/hero/sara-portrett2.webp';

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
    role: 'Head of Growth / Marketing',
    image: saraPortrait,
    bio: 'Masters in Computer Science with a passion for innovation and entrepreneurship.',
    social: {
      linkedin: '#',
      email: 'sara@aprikosventure.com'
    }
  },
  {
    name: 'Under hiring',
    role: 'Venture Builder',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1600',
    bio: 'Venture builder with a passion for creating innovative and scalable businesses.',
    social: {
      linkedin: '#',
      email: 'info@aprikosventure.com'
    }
  }
] as const;