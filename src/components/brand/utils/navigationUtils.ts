import { MouseEvent } from 'react';

export const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};