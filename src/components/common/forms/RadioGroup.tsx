import React from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export default function RadioGroup({ name, options, value, onChange, label }: RadioGroupProps) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="mt-2 grid grid-cols-2 gap-3">
        {options.map((option) => (
          <label 
            key={option.value}
            className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 hover:bg-slate-50 cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="text-purple-600 focus:ring-purple-600"
            />
            <span className="text-sm text-slate-900">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}