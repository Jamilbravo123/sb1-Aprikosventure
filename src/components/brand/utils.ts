import { LogoVariant } from './types';

export const getLogoClasses = (variant: LogoVariant): string => {
  switch (variant) {
    case 'light':
      return 'brightness-0 invert';
    case 'dark':
      return 'brightness-0';
    default:
      return '';
  }
};