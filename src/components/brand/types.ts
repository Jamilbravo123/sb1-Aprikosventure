export type LogoVariant = 'default' | 'light' | 'dark';

export interface LogoProps {
  className?: string;
  variant?: LogoVariant;
}

export interface LogoLinkProps extends LogoProps {
  href?: string;
}