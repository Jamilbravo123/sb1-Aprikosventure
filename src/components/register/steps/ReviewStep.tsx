import type { StepProps } from '../types';
import WizardShell from '../WizardShell';

const TYPE_LABELS: Record<string, string> = {
  private: 'Private Investor',
  institutional: 'Institutional',
  family_office: 'Family Office',
  fund: 'Fund / LP',
};

const COMMITMENT_LABELS: Record<string, string> = {
  '100k-250k': '€100K–250K',
  '250k-1m': '€250K–1M',
  '1m_plus': '€1M+',
  undisclosed: 'Undisclosed',
};

const INTEREST_LABELS: Record<string, string> = {
  digital_assets: 'Digital Assets',
  healthcare: 'Health Tech',
  brands: 'Brands',
  ai_studio: 'AI Studio',
  all: 'All Verticals',
};

export default function ReviewStep({ data, onNext, onBack }: StepProps) {
  const rows = [
    { label: 'Type', value: TYPE_LABELS[data.investorType ?? ''] },
    { label: 'Name', value: data.fullName },
    { label: 'Email', value: data.email },
    { label: 'Phone', value: data.phone },
    { label: 'Company', value: data.company || '—' },
    { label: 'Country', value: data.country },
    { label: 'Interest', value: data.interests.map((i) => INTEREST_LABELS[i]).join(' · '), gold: true },
    { label: 'Commitment', value: COMMITMENT_LABELS[data.commitment ?? ''], gold: true },
  ];

  return (
    <WizardShell
      step={5}
      totalSteps={6}
      stepLabel="Review"
      question={<>Everything <em className="deck-italic-gold">correct?</em></>}
      onNext={onNext}
      onBack={onBack}
      nextLabel="Submit Registration →"
    >
      <table className="deck-facts" style={{ maxWidth: '780px' }}>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td>{r.label}</td>
              <td style={r.gold ? { color: 'var(--deck-gold-light)' } : undefined}>
                {r.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </WizardShell>
  );
}
