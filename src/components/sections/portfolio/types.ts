export type CategoryKey = 'Health Intelligence' | 'Distributed Ledger Technology';

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