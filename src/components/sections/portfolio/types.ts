export type CategoryKey = 'AI' | 'DLT';

export type CompanyStatus = 'active' | 'development';

export interface PortfolioItem {
  title: string;
  description: string;
  image: string;
  status: CompanyStatus;
  tags: string[];
}