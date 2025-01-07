import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormInputProps {
  icon: LucideIcon;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
}

export default function FormInput({ 
  icon: Icon, 
  type, 
  value, 
  onChange, 
  placeholder, 
  error 
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-lg border-0 py-2 pl-10 pr-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-purple-600"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}