import type { ReactNode } from 'react';

interface WizardShellProps {
  step: number;
  totalSteps: number;
  stepLabel: string;
  question: ReactNode;
  children: ReactNode;
  onNext: () => void;
  onBack: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showBack?: boolean;
}

export default function WizardShell({
  step,
  totalSteps,
  stepLabel,
  question,
  children,
  onNext,
  onBack,
  nextLabel = 'Continue →',
  nextDisabled = false,
  showBack = true,
}: WizardShellProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !nextDisabled) {
      e.preventDefault();
      onNext();
    }
  };

  return (
    <div className="deck-page" onKeyDown={handleKeyDown}>
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center"
        style={{
          padding: 'clamp(32px, 5vw, 64px)',
          background: 'var(--deck-bg-2)',
        }}
      >
        <div className="deck-progress mb-12 w-full" style={{ maxWidth: '640px' }}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className="deck-progress-seg"
              data-state={i < step ? 'done' : i === step ? 'current' : undefined}
            />
          ))}
        </div>

        <div className="deck-kicker mb-4" style={{ fontSize: '12px' }}>
          Step {step + 1} · {stepLabel}
        </div>

        <h2
          className="deck-display mb-10"
          style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}
        >
          {question}
        </h2>

        <div className="w-full flex justify-center">{children}</div>

        <div className="flex items-center justify-center gap-4 pt-10">
          {showBack && (
            <button className="deck-btn-ghost" onClick={onBack}>
              ← Back
            </button>
          )}
          <button
            className="deck-btn-primary"
            onClick={onNext}
            disabled={nextDisabled}
          >
            {nextLabel}
          </button>
        </div>
        <span
          className="mt-4"
          style={{
            fontFamily: 'var(--deck-f-mono)',
            fontSize: '10px',
            color: 'var(--deck-ink-faintest)',
            letterSpacing: '0.1em',
          }}
        >
          ↵ Enter
        </span>
      </div>
    </div>
  );
}
