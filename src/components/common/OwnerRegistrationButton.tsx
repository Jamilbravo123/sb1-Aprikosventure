import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import InvestorPortalPopup from '../portal/InvestorPortalPopup';

export default function OwnerRegistrationButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <style jsx>{`
        @keyframes gentlePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        .gentle-pulse {
          animation: gentlePulse 3s ease-in-out infinite;
        }
      `}</style>
      <button
        onClick={() => setShowPopup(true)}
        className="
          inline-flex items-center gap-2 rounded-lg 
          bg-[#0B2545] px-4 py-2 text-sm font-semibold text-white 
          hover:bg-[#0B2545]/90 transition-all duration-300 
          w-full lg:w-auto justify-center lg:justify-start
          gentle-pulse hover:animate-none
          shadow-sm hover:shadow-md
        "
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