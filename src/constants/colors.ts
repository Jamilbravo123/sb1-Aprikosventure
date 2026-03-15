// Brand Colors
export const colors = {
  primary: {
    blue: '#0F4C81', // Corporate blue
    navy: '#141420', // Deep dark
    gold: '#C9935E', // Warm copper
  },
  secondary: {
    slate: '#64748B', // Refined slate
    steel: '#475569', // Steel blue-gray
  },
  text: {
    primary: '#ffffff',
    secondary: '#bbbbbb',
    light: '#777777',
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
    primary: 'bg-gradient-to-r from-[#0c0c0c] to-[#141420]',
    secondary: 'bg-gradient-to-r from-[#141420] to-[#C9935E]',
  },

  // Background gradients
  background: {
    primary: 'bg-gradient-to-tr from-[#0c0c0c] to-[#141420]',
    hero: 'bg-gradient-to-r from-slate-100 to-slate-50',
    card: 'bg-gradient-to-b from-white to-slate-50',
  },

  // Border gradients
  border: {
    primary: 'border-gradient-to-r from-[#0c0c0c] to-[#141420]',
  },
} as const;

// Gradient CSS Variables (for custom applications)
export const gradientCSS = {
  brand: {
    primary: 'linear-gradient(to right, #0c0c0c, #141420)',
    secondary: 'linear-gradient(to right, #141420, #C9935E)',
  },
  background: {
    primary: 'linear-gradient(to top right, #0c0c0c, #141420)',
    hero: 'linear-gradient(to right, rgb(241, 245, 249), rgb(248, 250, 252))',
  },
} as const;

// Dark Theme - Used across site
export const darkTheme = {
  primary: '#0c0c0c',
  secondary: '#141420',
  elevated: '#141420',
  text: {
    primary: '#ffffff',
    secondary: '#bbbbbb',
    muted: '#777777',
    dim: '#555555',
    ghost: '#333333',
  },
  glass: {
    background: 'rgba(20, 20, 32, 0.4)',
    border: 'rgba(100, 100, 120, 0.08)',
    borderHover: 'rgba(201, 147, 94, 0.2)',
  },
  gold: {
    primary: '#C9935E',
    light: '#E8C896',
    dark: '#A67A45',
  },
} as const;

// Dark gradient definitions for public site
export const darkGradients = {
  hero: 'bg-gradient-to-br from-[#0c0c0c] via-[#141420] to-[#0c0c0c]',
  goldText: 'bg-gradient-to-r from-[#C9935E] via-[#E8C896] to-[#C9935E]',
  goldLine: 'bg-gradient-to-r from-transparent via-[rgba(201,147,94,0.4)] to-transparent',
  section: 'bg-gradient-to-b from-[#0c0c0c] to-[#141420]',
} as const;
