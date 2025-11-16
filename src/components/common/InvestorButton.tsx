import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function InvestorButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/investor-login')}
      className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors w-full lg:w-auto justify-center lg:justify-start"
    >
      <Lock className="h-4 w-4" />
      Member Club
    </button>
  );
}