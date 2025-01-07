import React from 'react';
import InvestorButton from '../common/InvestorButton';
import OwnerRegistrationButton from '../common/OwnerRegistrationButton';

export default function NavbarActions() {
  return (
    <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
      <InvestorButton />
      <OwnerRegistrationButton />
    </div>
  );
}