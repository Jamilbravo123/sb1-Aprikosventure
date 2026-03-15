import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../lib/gsap';

const stats = [
  { value: 9, label: 'Ventures', suffix: '' },
  { value: 6, label: 'Countries', suffix: '' },
  { value: 5, label: 'Industries', suffix: '' },
  { value: 4, label: 'Years Building', suffix: '+' },
];

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const counters = sectionRef.current.querySelectorAll('.stat-value');
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-value') || '0', 10);
      const obj = { val: 0 };

      gsap.to(obj, {
        scrollTrigger: {
          trigger: counter,
          start: 'top 85%',
          once: true,
        },
        val: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
          const suffix = counter.getAttribute('data-suffix') || '';
          counter.textContent = Math.round(obj.val) + suffix;
        },
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-20 bg-[#0A0E1A]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="stat-value font-display text-4xl sm:text-5xl font-bold text-gold mb-2"
                data-value={stat.value}
                data-suffix={stat.suffix}
              >
                {stat.value}{stat.suffix}
              </div>
              <p className="text-sm text-slate-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
