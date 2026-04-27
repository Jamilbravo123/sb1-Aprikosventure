import type { StepProps } from '../types';
import WizardShell from '../WizardShell';

export default function IdentityStep({ data, onUpdate, onNext, onBack }: StepProps) {
  const isValid = data.fullName.trim() !== '' && data.email.includes('@') && data.phone.trim() !== '';

  return (
    <WizardShell
      step={1}
      totalSteps={6}
      stepLabel="Your Identity"
      question={<>Let's get <em className="deck-italic-gold">acquainted</em></>}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!isValid}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ maxWidth: '520px' }}>
        <input
          className="deck-field"
          placeholder="Full name"
          value={data.fullName}
          onChange={(e) => onUpdate({ fullName: e.target.value })}
          autoFocus
        />
        <input
          className="deck-field"
          type="email"
          placeholder="Email address"
          value={data.email}
          onChange={(e) => onUpdate({ email: e.target.value })}
        />
        <input
          className="deck-field sm:col-span-2"
          type="tel"
          placeholder="Phone number (with country code)"
          value={data.phone}
          onChange={(e) => onUpdate({ phone: e.target.value })}
        />
      </div>
    </WizardShell>
  );
}
