import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import InvestorPortalPopup from '../portal/InvestorPortalPopup';

export default function OwnerRegistrationButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowPopup(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-[#0B2545] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0B2545]/90 transition-colors w-full lg:w-auto justify-center lg:justify-start"
      >
        <UserPlus className="h-4 w-4" />
        Become an Owner
      </button>

      <InvestorPortalPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title="Private Placement Registration"
        heading="Opening Soon!"
        message="Private Placement Opening Soon for Eligible Investors – Stay Tuned!"
      />
    </>
  );
}