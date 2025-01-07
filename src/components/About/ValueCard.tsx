import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function ValueCard({ icon: Icon, title, description }: ValueCardProps) {
  return (
    <div className="flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-lg">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
        <Icon className="h-8 w-8 text-purple-600" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-4 text-gray-600">{description}</p>
    </div>
  );
}