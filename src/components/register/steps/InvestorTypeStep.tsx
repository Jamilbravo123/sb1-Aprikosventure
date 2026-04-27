import type { StepProps, InvestorType } from '../types';
import WizardShell from '../WizardShell';

const OPTIONS: { value: InvestorType; label: string; sub: string }[] = [
  { value: 'private', label: 'Private Investor', sub: 'Individual / HNW' },
  { value: 'institutional', label: 'Institutional', sub: 'Pension / Sovereign' },
  { value: 'family_office', label: 'Family Office', sub: 'Single or Multi' },
  { value: 'fund', label: 'Fund / LP', sub: 'VC / PE / FoF' },
];

export default function InvestorTypeStep({ data, onUpdate, onNext, onBack }: StepProps) {
  return (
    <WizardShell
      step={0}
      totalSteps={6}
      stepLabel="Investor Type"
      question={<>What best describes <em className="deck-italic-gold">you?</em></>}
      onNext={onNext}
      onBack={onBack}
      showBack={false}
      nextDisabled={!data.investorType}
    >
      <div className="grid grid-cols-2 gap-3" style={{ maxWidth: '520px' }}>
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className="deck-chip"
            data-selected={data.investorType === opt.value}
            onClick={() => onUpdate({ investorType: opt.value })}
          >
            <span className="deck-chip-title">{opt.label}</span>
            <span className="deck-chip-sub">{opt.sub}</span>
          </button>
        ))}
      </div>
    </WizardShell>
  );
}
