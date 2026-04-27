import { useState } from 'react';
import type { StepProps } from '../types';
import WizardShell from '../WizardShell';

const COUNTRY_CODES = [
  { code: '+47', flag: '🇳🇴', country: 'Norway' },
  { code: '+46', flag: '🇸🇪', country: 'Sweden' },
  { code: '+45', flag: '🇩🇰', country: 'Denmark' },
  { code: '+358', flag: '🇫🇮', country: 'Finland' },
  { code: '+44', flag: '🇬🇧', country: 'United Kingdom' },
  { code: '+49', flag: '🇩🇪', country: 'Germany' },
  { code: '+33', flag: '🇫🇷', country: 'France' },
  { code: '+41', flag: '🇨🇭', country: 'Switzerland' },
  { code: '+352', flag: '🇱🇺', country: 'Luxembourg' },
  { code: '+31', flag: '🇳🇱', country: 'Netherlands' },
  { code: '+1', flag: '🇺🇸', country: 'United States' },
  { code: '+1', flag: '🇨🇦', country: 'Canada' },
  { code: '+971', flag: '🇦🇪', country: 'United Arab Emirates' },
  { code: '+966', flag: '🇸🇦', country: 'Saudi Arabia' },
  { code: '+92', flag: '🇵🇰', country: 'Pakistan' },
  { code: '+91', flag: '🇮🇳', country: 'India' },
  { code: '+65', flag: '🇸🇬', country: 'Singapore' },
  { code: '+852', flag: '🇭🇰', country: 'Hong Kong' },
  { code: '+81', flag: '🇯🇵', country: 'Japan' },
  { code: '+61', flag: '🇦🇺', country: 'Australia' },
];

export default function IdentityStep({ data, onUpdate, onNext, onBack }: StepProps) {
  const [dialCode, setDialCode] = useState('+47');
  const isValid = data.fullName.trim() !== '' && data.email.includes('@') && data.phone.trim() !== '';

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^\d\s]/g, '');
    onUpdate({ phone: `${dialCode} ${digits}` });
  };

  const handleDialCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.selectedOptions[0];
    const newCode = selected.value;
    const country = selected.dataset.country ?? '';
    setDialCode(newCode);
    const digits = data.phone.replace(/^\+\d+\s*/, '');
    onUpdate({ phone: `${newCode} ${digits}`, country });
  };

  const phoneDigits = data.phone.replace(/^\+\d+\s*/, '');

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ maxWidth: '640px' }}>
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
        <div className="sm:col-span-2 flex" style={{ gap: 0 }}>
          <select
            className="deck-field"
            value={dialCode}
            onChange={handleDialCodeChange}
            style={{
              width: '120px',
              flexShrink: 0,
              borderRight: 'none',
              color: 'var(--deck-ink)',
              fontSize: '16px',
            }}
          >
            {COUNTRY_CODES.map((c) => (
              <option key={`${c.flag}-${c.code}`} value={c.code} data-country={c.country}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <input
            className="deck-field"
            type="tel"
            placeholder="Phone number"
            value={phoneDigits}
            onChange={handlePhoneChange}
            style={{ flex: 1 }}
          />
        </div>
      </div>
    </WizardShell>
  );
}
