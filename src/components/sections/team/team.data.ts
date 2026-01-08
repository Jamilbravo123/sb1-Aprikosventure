import type { TeamMember } from './types';
import jamilPortrait from '../../../assets/images/hero/jamil-portrett2.png';
import saraPortrait from '../../../assets/images/hero/sara-portrett2.webp';
import farooqPortrait from '../../../assets/images/hero/Farooq1.jpg';
import vishalPortrait from '../../../assets/images/hero/Vishal1.jpg';
import joniPortrait from '../../../assets/images/hero/Joni1.jpg';
import robertPortrait from '../../../assets/images/hero/robert.jpeg';

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
    role: 'Co-founder / Venture Builder',
    image: saraPortrait,
    bio: 'Masters in Data Science with a passion for innovation and entrepreneurship.',
    social: {
      linkedin: 'https://no.linkedin.com/in/sara-rana-35640a2a2',
      email: 'sara@novemberproperty.com'
    }
  },
  {
    name: 'Dr. Farooq Maqsood',
    role: 'Co-founder and Venture Builder',
    image: farooqPortrait,
    bio: 'Farooq brings extensive clinical experience and domain expertise to spearhead our health innovation ventures.',
    social: {
      linkedin: 'https://www.linkedin.com/in/farooq-maqsood-437b3361/',
      email: 'contact@aprikosventure.com'
    }
  },
  {
    name: 'Robert Lyngmoe',
    role: 'Venture Builder',
    image: robertPortrait,
    bio: 'Experienced venture builder driving innovation and growth across the Aprikos ecosystem.',
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