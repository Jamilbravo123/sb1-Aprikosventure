import type { TeamMember } from './types';
import jamilPortrait from '../../../assets/images/hero/jamil-portrett2.png';
import saraPortrait from '../../../assets/images/hero/sara-portrett2.webp';
import farooqPortrait from '../../../assets/images/hero/Farooq1.jpg';
import vishalPortrait from '../../../assets/images/hero/Vishal1.jpg';
import joniPortrait from '../../../assets/images/hero/Joni1.jpg';

export const teamMembers: TeamMember[] = [
  {
    name: 'Jamil Rehman',
    role: 'CEO & Founder',
    image: joniPortrait,
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
    bio: 'Masters in Data Science with a passion for innovation and entrepreneurship.',
    social: {
      linkedin: 'https://no.linkedin.com/in/sara-rana-35640a2a2',
      email: 'sara@novemberproperty.com'
    }
  },
  {
    name: 'Under hiring',
    role: 'Investment Associate | Deal Support & Portfolio Monitoring',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1600',
    bio: 'Supports deal flow, market research, and investment memos. Assists in portfolio tracking and communication.',
    social: {
      linkedin: '#',
      email: 'info@aprikosventure.com'
    }
  },
  {
    name: 'Dr. Farooq Maqsood',
    role: 'Partner & Venture Builder',
    image: farooqPortrait,
    bio: 'As Partner at Aprikos Venture, Farooq brings clinical insight to lead our health innovation.',
    social: {
      linkedin: '#',
      email: 'info@aprikosventure.com'
    }
  },
  {
    name: 'Vishal Sarna',
    role: 'Partner & Venture Builder',
    image: vishalPortrait,
    bio: 'As a property expert, Vishal knows how to build something up from the start. He brings deep industry knowledge and strategic insight to our team.',
    social: {
      linkedin: '#',
      email: 'info@aprikosventure.com'
    }
  }
] as const;