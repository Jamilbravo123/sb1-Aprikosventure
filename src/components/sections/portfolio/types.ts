export type CategoryKey = 'Health Intelligence' | 'Web3 & Software Innovation';

export type CompanyStatus = 'active' | 'development';

export interface PortfolioItem {
  title: string;
  description: string;
  image: string;
  status: CompanyStatus;
  tags: string[];
  link?: string;
  comingSoon?: boolean;
}