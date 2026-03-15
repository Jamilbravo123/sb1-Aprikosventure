import type { ModelStep } from './venture-model.data';

interface TimelineStepProps {
  step: ModelStep;
}

export default function TimelineStep({ step }: TimelineStepProps) {
  return (
    <div className="flex-1 text-center relative px-4 py-6 md:py-0 timeline-step">
      <div className="text-[#333] text-[10px] tracking-[2px] mb-1.5">{step.number}</div>
      <div className="w-3.5 h-3.5 rounded-full bg-[#0c0c0c] border-2 border-gold mx-auto mb-6 relative z-10 shadow-[0_0_12px_rgba(201,147,94,0.3)] timeline-dot" />
      <h3 className="font-display text-[22px] font-bold text-gold-light mb-2.5">{step.title}</h3>
      <p className="text-[#666] text-[13px] leading-relaxed max-w-[260px] mx-auto">{step.description}</p>
    </div>
  );
}
