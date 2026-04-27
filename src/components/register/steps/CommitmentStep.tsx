import type { StepProps, Commitment } from '../types';
import WizardShell from '../WizardShell';

const OPTIONS: { value: Commitment; label: string }[] = [
  { value: '100k-250k', label: '€100K–250K' },
  { value: '250k-1m', label: '€250K–1M' },
  { value: '1m_plus', label: '€1M+' },
  { value: 'undisclosed', label: 'Undisclosed' },
];

export default function CommitmentStep({ data, onUpdate, onNext, onBack }: StepProps) {
  return (
    <WizardShell
      step={4}
      totalSteps={6}
      stepLabel="Investment"
      question={<>Anticipated <em className="deck-italic-gold">commitment?</em></>}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!data.commitment}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ maxWidth: '640px' }}>
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className="deck-chip"
            data-selected={data.commitment === opt.value}
            onClick={() => onUpdate({ commitment: opt.value })}
          >
            <span className="deck-chip-title">{opt.label}</span>
          </button>
        ))}
      </div>
    </WizardShell>
  );
}
