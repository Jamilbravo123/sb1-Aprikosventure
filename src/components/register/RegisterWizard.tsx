import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { INITIAL_WIZARD_DATA, type WizardData } from './types';
import InvestorTypeStep from './steps/InvestorTypeStep';
import IdentityStep from './steps/IdentityStep';
import OrganisationStep from './steps/OrganisationStep';
import InterestStep from './steps/InterestStep';
import CommitmentStep from './steps/CommitmentStep';
import ReviewStep from './steps/ReviewStep';
import MagicLinkSent from './MagicLinkSent';

export default function RegisterWizard() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(INITIAL_WIZARD_DATA);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (updates: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => {
    if (step === 0) {
      navigate('/register');
    } else {
      setStep((s) => s - 1);
    }
  };

  const submit = async () => {
    setError(null);

    // Try to insert — if duplicate email, just send magic link
    const { error: insertError } = await supabase.from('investors').insert({
      investor_type: data.investorType,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      company: data.company || null,
      country: data.country,
      interests: data.interests,
      commitment: data.commitment,
    });

    if (insertError) {
      // Duplicate email (already registered) — just send magic link
      if (insertError.code === '23505') {
        const { error: signInError } = await signIn(data.email);
        if (signInError) {
          console.error('Magic link error (existing user):', signInError);
          setError('Could not send the sign-in link. Please try again in a moment.');
          return;
        }
        setSubmitted(true);
        return;
      }
      console.error('Insert error:', insertError);
      console.error('Insert error:', insertError);
      setError('Registration failed. Please check your details and try again.');
      return;
    }

    const { error: signInError } = await signIn(data.email);
    if (signInError) {
      console.error('Magic link error:', signInError);
      setError('Registration saved, but we could not send the sign-in link. Please try again in a moment.');
      return;
    }

    setSubmitted(true);
  };

  const handleResend = async () => {
    await signIn(data.email);
  };

  if (submitted) {
    return <MagicLinkSent email={data.email} onResend={handleResend} />;
  }

  const stepProps = { data, onUpdate: update, onNext: step === 5 ? submit : next, onBack: back };

  const steps = [
    <InvestorTypeStep key={0} {...stepProps} />,
    <IdentityStep key={1} {...stepProps} />,
    <OrganisationStep key={2} {...stepProps} />,
    <InterestStep key={3} {...stepProps} />,
    <CommitmentStep key={4} {...stepProps} />,
    <ReviewStep key={5} {...stepProps} />,
  ];

  return (
    <>
      {error && (
        <div
          style={{
            position: 'fixed',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#c94a4a',
            color: '#fff',
            padding: '12px 24px',
            fontSize: '13px',
            zIndex: 1000,
            borderRadius: '4px',
          }}
        >
          {error}
          <button
            style={{ marginLeft: '12px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            onClick={() => setError(null)}
          >
            ✕
          </button>
        </div>
      )}
      {steps[step]}
    </>
  );
}
