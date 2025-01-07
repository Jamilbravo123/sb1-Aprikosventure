import React from 'react';
import { CircleDot } from 'lucide-react';
import { CompanyStatus } from '../types';

interface StatusBadgeProps {
  status: CompanyStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    active: {
      className: 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100',
      label: 'Active'
    },
    development: {
      className: 'bg-amber-50 text-amber-700 group-hover:bg-amber-100',
      label: 'Development'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full transition-colors ${config.className}`}>
      <CircleDot className="h-3 w-3" />
      {config.label}
    </span>
  );
}