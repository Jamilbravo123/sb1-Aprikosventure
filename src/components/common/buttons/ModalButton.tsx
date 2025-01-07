import React from 'react';
import { LucideIcon } from 'lucide-react';
import { gradients } from '../../../constants/colors';

interface ModalButtonProps {
  onClick: () => void;
  icon?: LucideIcon;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export default function ModalButton({ 
  onClick, 
  icon: Icon, 
  children, 
  variant = 'primary' 
}: ModalButtonProps) {
  const baseClasses = "w-full rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2";
  const variantClasses = variant === 'primary' 
    ? `${gradients.background.primary} text-white hover:opacity-90`
    : 'bg-slate-100 text-slate-700 hover:bg-slate-200';
  
  const paddingClasses = "px-4 py-2.5";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${paddingClasses}`}
    >
      {children}
      {Icon && <Icon className="w-4 h-4" />}
    </button>
  );
}