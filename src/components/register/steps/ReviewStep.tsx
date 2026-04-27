import { useState } from 'react';
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
  const [confirmed, setConfirmed] = useState(false);

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
      nextDisabled={!confirmed}
    >
      <div style={{ maxWidth: '780px' }}>
        <table className="deck-facts" style={{ width: '100%' }}>
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

        <label
          className="flex items-start gap-3 mt-8 cursor-pointer"
          style={{ textAlign: 'left' }}
        >
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            style={{
              accentColor: '#C9935E',
              width: '18px',
              height: '18px',
              marginTop: '2px',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: '13px',
              lineHeight: 1.6,
              color: 'var(--deck-ink-dim)',
            }}
          >
            I confirm that I am a professional or qualified investor and understand
            that this registration does not constitute an investment commitment.
          </span>
        </label>
      </div>
    </WizardShell>
  );
}
