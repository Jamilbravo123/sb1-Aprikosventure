import React from 'react';
import { LucideIcon } from 'lucide-react';
import { colors } from '../../../constants/colors';

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function ValueCard({ icon: Icon, title, description }: ValueCardProps) {
  return (
    <div className="flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-slate-100`}>
        <Icon className={`h-8 w-8 text-[${colors.primary.blue}]`} />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-4 text-slate-600">{description}</p>
    </div>
  );
}