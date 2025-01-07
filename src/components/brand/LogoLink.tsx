import React from 'react';
import Logo from './Logo';
import { BRAND_NAME } from '../../constants/brand';
import { LogoLinkProps } from './types';
import { handleLogoClick } from './utils/navigationUtils';

export default function LogoLink({ 
  href = '#', 
  className = '', 
  variant = 'default' 
}: LogoLinkProps) {
  return (
    <a 
      href={href} 
      onClick={handleLogoClick}
      className={`inline-flex items-center hover:opacity-90 transition-opacity ${className}`}
      aria-label={`${BRAND_NAME} Home`}
    >
      <Logo variant={variant} />
    </a>
  );
}