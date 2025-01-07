import React from 'react';
import { LogoProps } from './types';
import { getLogoClasses } from './utils';
import { BRAND_NAME } from '../../constants/brand';
import aprikosLogo from '../../assets/images/logos/aprikos-logo.png';

export default function Logo({ className = '', variant = 'default' }: LogoProps) {
  const logoClasses = getLogoClasses(variant);
  
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={aprikosLogo}
        alt={BRAND_NAME}
        className={`h-16 lg:h-20 w-auto object-contain ${logoClasses}`}
        style={{ 
          imageRendering: 'crisp-edges',
          WebkitFontSmoothing: 'antialiased',
        }}
      />
    </div>
  );
}