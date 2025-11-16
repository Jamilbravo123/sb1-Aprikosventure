import React from 'react';

interface AvatarProps {
  email: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Avatar({ email, size = 'md', className = '' }: AvatarProps) {
  // Extract initials from email
  const getInitials = (email: string): string => {
    const name = email.split('@')[0];
    const parts = name.split(/[._-]/);
    
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const initials = getInitials(email);

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-[#0F4C81] to-[#1E2A4A] 
        text-white font-semibold flex items-center justify-center ${className}`}
      title={email}
    >
      {initials}
    </div>
  );
}

