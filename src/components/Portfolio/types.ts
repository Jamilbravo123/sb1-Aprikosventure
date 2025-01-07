export interface PortfolioItem {
  title: string;
  description: string;
  image: string;
  status: 'active' | 'development';
  link?: string;
}