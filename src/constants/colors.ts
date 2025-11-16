// Brand Colors
export const colors = {
  primary: {
    blue: '#0F4C81', // Corporate blue
    navy: '#1E2A4A', // Deep navy
    gold: '#B8860B', // Professional gold
  },
  secondary: {
    slate: '#64748B', // Refined slate
    steel: '#475569', // Steel blue-gray
  },
  text: {
    primary: '#1E293B', // slate-900
    secondary: '#475569', // slate-600
    light: '#94A3B8', // slate-400
  },
  background: {
    light: '#F8FAFC', // slate-50
    subtle: '#F1F5F9', // slate-100
  },
} as const;

// Gradients
export const gradients = {
  // Text gradients
  brand: {
    primary: 'bg-gradient-to-r from-[#0F4C81] to-[#1E2A4A]',
    secondary: 'bg-gradient-to-r from-[#1E2A4A] to-[#B8860B]',
  },
  
  // Background gradients
  background: {
    primary: 'bg-gradient-to-tr from-[#0F4C81] to-[#1E2A4A]',
    hero: 'bg-gradient-to-r from-slate-100 to-slate-50',
    card: 'bg-gradient-to-b from-white to-slate-50',
  },
  
  // Border gradients
  border: {
    primary: 'border-gradient-to-r from-[#0F4C81] to-[#1E2A4A]',
  },
} as const;

// Gradient CSS Variables (for custom applications)
export const gradientCSS = {
  brand: {
    primary: 'linear-gradient(to right, #0F4C81, #1E2A4A)',
    secondary: 'linear-gradient(to right, #1E2A4A, #B8860B)',
  },
  background: {
    primary: 'linear-gradient(to top right, #0F4C81, #1E2A4A)',
    hero: 'linear-gradient(to right, rgb(241, 245, 249), rgb(248, 250, 252))',
  },
} as const;

// Dark Theme - Private Lounge
export const darkTheme = {
  background: {
    primary: '#0A0E1A',      // Deep navy-black
    secondary: '#111827',     // Slate-900
    elevated: '#1E293B',      // Slate-800
  },
  text: {
    primary: '#F1F5F9',       // Near white
    secondary: '#CBD5E1',     // Slate-300
    muted: '#94A3B8',         // Slate-400
  },
  glass: {
    card: 'rgba(30, 41, 59, 0.5)',  // Semi-transparent slate
    border: 'rgba(148, 163, 184, 0.2)',
  },
  gold: '#B8860B',  // Existing brand gold
} as const;