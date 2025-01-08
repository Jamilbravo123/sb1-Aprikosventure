import React from 'react';
import { LucideIcon } from 'lucide-react';
import { colors } from '../../../constants/colors';
import { useInView } from '../../../hooks/useInView';

interface ProcessStepProps {
  icon: LucideIcon;
  title: string;
  description: string;
  number: string;
  isLast?: boolean;
}

export default function ProcessStep({ 
  icon: Icon, 
  title, 
  description, 
  number, 
  isLast = false 
}: ProcessStepProps) {
  const delay = parseInt(number) * 0.4;
  const [ref, isInView] = useInView();
  
  return (
    <div 
      ref={ref}
      className={`relative opacity-0 ${isInView ? 'animate-slide-in-left' : ''}`} 
      style={{ animationDelay: isInView ? `${delay}s` : undefined }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm relative group transition-all duration-300 hover:shadow-md">
          <Icon className="h-8 w-8 text-slate-600 group-hover:text-purple-600 transition-colors" />
          <span 
            className={`absolute -top-2 -right-2 h-6 w-6 rounded-full bg-purple-600 text-white text-sm flex items-center justify-center font-medium shadow-sm opacity-0 ${isInView ? 'animate-scale-up' : ''}`}
            style={{ animationDelay: isInView ? `${delay + 0.5}s` : undefined }}
          >
            {number}
          </span>
        </div>
        <h3 
          className={`mt-6 text-xl font-semibold text-slate-900 opacity-0 ${isInView ? 'animate-slide-up' : ''}`}
          style={{ animationDelay: isInView ? `${delay + 0.7}s` : undefined }}
        >
          {title}
        </h3>
        <p 
          className={`mt-4 text-slate-600 opacity-0 ${isInView ? 'animate-slide-up' : ''}`}
          style={{ animationDelay: isInView ? `${delay + 0.9}s` : undefined }}
        >
          {description}
        </p>
      </div>
      {!isLast && (
        <div 
          className={`hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-200 to-transparent opacity-0 ${isInView ? 'animate-fade-in' : ''}`}
          style={{ animationDelay: isInView ? `${delay + 1.1}s` : undefined }}
        />
      )}
    </div>
  );
}