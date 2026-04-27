import type { StepProps, Vertical } from '../types';
import WizardShell from '../WizardShell';

const OPTIONS: { value: Vertical; label: string }[] = [
  { value: 'digital_assets', label: 'Digital Assets' },
  { value: 'healthcare', label: 'Health Tech' },
  { value: 'brands', label: 'Brands' },
  { value: 'ai_studio', label: 'AI Studio' },
  { value: 'all', label: 'All Verticals' },
];

export default function InterestStep({ data, onUpdate, onNext, onBack }: StepProps) {
  const toggle = (v: Vertical) => {
    if (v === 'all') {
      onUpdate({ interests: ['all'] });
      return;
    }
    const without = data.interests.filter((i) => i !== 'all' && i !== v);
    if (data.interests.includes(v)) {
      onUpdate({ interests: without });
    } else {
      onUpdate({ interests: [...without, v] });
    }
  };

  return (
    <WizardShell
      step={3}
      totalSteps={6}
      stepLabel="Interest"
      question={<>Which verticals <em className="deck-italic-gold">interest</em> you?</>}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={data.interests.length === 0}
    >
      <div className="grid grid-cols-5 gap-3" style={{ maxWidth: '780px' }}>
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className="deck-chip"
            data-selected={data.interests.includes(opt.value)}
            onClick={() => toggle(opt.value)}
          >
            <span className="deck-chip-title">{opt.label}</span>
          </button>
        ))}
      </div>
    </WizardShell>
  );
}
