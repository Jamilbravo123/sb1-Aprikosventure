import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  message: string;
}

export default function SuccessMessage({ message }: SuccessMessageProps) {
  return (
    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-4 rounded-lg">
      <CheckCircle className="h-5 w-5" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}