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
        className="min-h-screen flex flex-col"
        style={{
          padding: 'clamp(32px, 5vw, 64px)',
          background: 'var(--deck-bg-2)',
        }}
      >
        <div className="deck-progress mb-10">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className="deck-progress-seg"
              data-state={i < step ? 'done' : i === step ? 'current' : undefined}
            />
          ))}
        </div>

        <div className="deck-kicker mb-3">
          Step {step + 1} · {stepLabel}
        </div>

        <h2
          className="deck-display mb-8"
          style={{ fontSize: 'clamp(24px, 3vw, 32px)' }}
        >
          {question}
        </h2>

        <div className="flex-1">{children}</div>

        <div className="flex items-center gap-4 pt-8 mt-auto">
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
          <span
            className="ml-auto"
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
    </div>
  );
}
