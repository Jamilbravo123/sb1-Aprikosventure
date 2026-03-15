import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../../lib/gsap';
import { modelSteps } from './venture-model.data';
import TimelineStep from './TimelineStep';

export default function VentureModel() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !lineRef.current) return;

    gsap.fromTo(lineRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 30%',
          scrub: true,
        },
      },
    );

    const dots = sectionRef.current.querySelectorAll('.timeline-dot');
    const steps = sectionRef.current.querySelectorAll('.timeline-step');

    gsap.from(dots, {
      scale: 0,
      duration: 0.5,
      stagger: 0.2,
      ease: 'back.out(2)',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 60%',
      },
    });

    gsap.from(steps, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 60%',
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-24 bg-[#0c0c0c]">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-gold text-[11px] tracking-[4px] uppercase mb-3.5">How We Work</p>
          <h2 className="font-display text-4xl font-bold mb-3.5">From Idea to Impact</h2>
          <p className="text-[#666] text-[15px] max-w-[460px] mx-auto leading-relaxed">
            A repeatable model for building ventures across markets and sectors.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-start relative px-5">
          <div
            ref={lineRef}
            className="absolute top-[28px] left-5 right-5 h-0.5 origin-left hidden md:block"
            style={{
              background: 'linear-gradient(90deg, rgba(201,147,94,0.1), rgba(201,147,94,0.4), rgba(201,147,94,0.4), rgba(201,147,94,0.1))',
            }}
          />
          {modelSteps.map((step) => (
            <TimelineStep key={step.number} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
