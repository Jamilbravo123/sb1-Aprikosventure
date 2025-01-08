import React from 'react';
import logo from '../../assets/images/aprikos-venture-logo.svg';

interface LogoProps {
  logoClasses?: string;
}

export default function Logo({ logoClasses = '' }: LogoProps) {
  return (
    <img
      src={logo}
      alt="Aprikos Venture"
      className={`h-24 w-auto ${logoClasses}`}
    />
  );
}