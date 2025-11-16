import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'sm' | 'md';
}

export default function Badge({ children, variant = 'primary', size = 'md' }: BadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-3 py-1'
  };

  const variantClasses = {
    primary: 'bg-blue-900/30 text-blue-300 border border-blue-700/30',
    secondary: 'bg-slate-700/50 text-slate-300 border border-slate-600/30',
    success: 'bg-emerald-900/30 text-emerald-300 border border-emerald-700/30',
    warning: 'bg-amber-900/30 text-amber-300 border border-amber-700/30'
  };

  return (
    <span className={`inline-block font-medium rounded-full ${sizeClasses[size]} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}

