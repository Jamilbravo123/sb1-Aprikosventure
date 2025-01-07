import React from 'react';
import { gradients } from '../../../constants/colors';

interface ShineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export default function ShineButton({ 
  children, 
  fullWidth = true,
  ...props 
}: ShineButtonProps) {
  return (
    <button
      {...props}
      className={`
        relative overflow-hidden
        ${fullWidth ? 'w-full' : 'w-auto'}
        rounded-lg ${gradients.background.primary} 
        px-4 py-2 text-sm font-semibold text-white 
        shadow-sm hover:opacity-90 transition-all
        before:absolute before:inset-0 
        before:translate-x-[-100%] before:animate-[shine_2s_infinite]
        before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
      `}
    >
      {children}
    </button>
  );
}