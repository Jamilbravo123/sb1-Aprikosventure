import React from 'react';
import { gradients } from '../../../constants/colors';

interface MobileMenuItemProps {
  href: string;
  label: string;
  onClick: () => void;
}

export default function MobileMenuItem({ href, label, onClick }: MobileMenuItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      onClick(); // Close menu first
      
      // Small delay to ensure smooth transition
      setTimeout(() => {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 300);
    }
  };

  const isAction = href === '#investor' || href === '#owner';

  return (
    <button 
      onClick={handleClick}
      className={`
        w-full text-left px-4 py-3 rounded-lg text-base font-medium
        transition-all duration-200
        ${isAction 
          ? `${gradients.background.primary} text-white hover:opacity-90` 
          : 'text-slate-900 hover:bg-slate-50'
        }
      `}
    >
      {label}
    </button>
  );
}