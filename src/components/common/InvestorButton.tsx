import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import InvestorPortalPopup from '../portal/InvestorPortalPopup';

export default function InvestorButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowPopup(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors w-full lg:w-auto justify-center lg:justify-start"
      >
        <Lock className="h-4 w-4" />
        Investor Portal
      </button>

      <InvestorPortalPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </>
  );
}