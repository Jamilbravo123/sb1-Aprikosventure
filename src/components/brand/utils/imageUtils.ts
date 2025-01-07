import { LogoVariant } from '../types';

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

export const validateImageDimensions = (
  width: number,
  height: number,
  minWidth = 0,
  minHeight = 0
): boolean => {
  return width >= minWidth && height >= minHeight;
};