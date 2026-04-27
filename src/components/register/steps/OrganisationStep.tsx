import type { StepProps } from '../types';
import WizardShell from '../WizardShell';

const COUNTRIES = [
  'Norway', 'Sweden', 'Denmark', 'Finland', 'United Kingdom', 'Germany',
  'France', 'Switzerland', 'Luxembourg', 'Netherlands', 'United States',
  'Canada', 'United Arab Emirates', 'Saudi Arabia', 'Pakistan', 'India',
  'Singapore', 'Hong Kong', 'Japan', 'Australia', 'Other',
];

const COMPANY_PLACEHOLDERS: Record<string, string> = {
  private: 'Company (optional)',
  institutional: 'Organisation name',
  family_office: 'Family office name',
  fund: 'Fund name',
};

export default function OrganisationStep({ data, onUpdate, onNext, onBack }: StepProps) {
  return (
    <WizardShell
      step={2}
      totalSteps={6}
      stepLabel="Organisation"
      question={<>Where are you <em className="deck-italic-gold">based?</em></>}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!data.country}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ maxWidth: '640px' }}>
        <input
          className="deck-field"
          placeholder={COMPANY_PLACEHOLDERS[data.investorType ?? 'private']}
          value={data.company}
          onChange={(e) => onUpdate({ company: e.target.value })}
        />
        <select
          className="deck-field"
          value={data.country}
          onChange={(e) => onUpdate({ country: e.target.value })}
          style={{ color: data.country ? 'var(--deck-ink)' : 'var(--deck-ink-faint)' }}
        >
          <option value="">Select country</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </WizardShell>
  );
}
