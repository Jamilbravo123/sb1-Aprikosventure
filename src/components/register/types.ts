export type InvestorType = 'private' | 'institutional' | 'family_office' | 'fund';
export type Commitment = '100k-250k' | '250k-1m' | '1m_plus' | 'undisclosed';
export type Vertical = 'digital_assets' | 'healthcare' | 'brands' | 'ai_studio' | 'all';

export interface WizardData {
  investorType: InvestorType | null;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  interests: Vertical[];
  commitment: Commitment | null;
}

export const INITIAL_WIZARD_DATA: WizardData = {
  investorType: null,
  fullName: '',
  email: '',
  phone: '',
  company: '',
  country: 'Norway',
  interests: [],
  commitment: null,
};

export interface StepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onNext: () => void;
  onBack: () => void;
}
