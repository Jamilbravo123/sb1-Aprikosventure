import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../../lib/gsap';
import brochureImg from '../../../assets/images/hero/brochure-picture.webp';

const stats = [
  { value: 8, label: 'Ventures' },
  { value: 6, label: 'Markets' },
  { value: 3, label: 'Verticals' },
  { value: 4, label: 'Years Building', suffix: '+' },
];

export default function Thesis() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Counter animation
    const counters = sectionRef.current.querySelectorAll('.stat-num');
    counters.forEach((el) => {
      const target = parseInt(el.getAttribute('data-value') || '0', 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
        onUpdate: () => {
          (el as HTMLElement).textContent = Math.round(obj.val) + suffix;
        },
      });
    });

    // Fade in content
    gsap.from(sectionRef.current.querySelectorAll('.thesis-animate'), {
      y: 20,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 65%',
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="about" className="py-24 bg-[#0c0c0c] relative overflow-hidden">
      {/* Subtle background image */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `url(${brochureImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 75%',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c] via-transparent to-[#0c0c0c]" />
      <div className="max-w-[1100px] mx-auto px-6 text-center relative z-10">
        <p className="thesis-animate text-gold text-[11px] tracking-[4px] uppercase mb-3.5">
          Why Aprikos Venture
        </p>
        <h2 className="thesis-animate font-display text-4xl font-bold mb-5 text-white">
          Where Innovation Meets<br />Emerging Opportunity
        </h2>
        <p className="thesis-animate text-[#777] text-base leading-[1.8] max-w-[600px] mx-auto mb-10">
          We focus on building companies where technology, capital, and emerging markets
          intersect. From AI and digital health to blockchain infrastructure and new
          digital economies. Our cross-border model connects Nordic precision with
          South Asian scale.
        </p>

        {/* TODO: Add founder image once photo is confirmed */}

        <div className="thesis-animate flex gap-12 justify-center flex-wrap">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="stat-num text-[28px] font-bold text-gold font-body"
                data-value={s.value}
                data-suffix={s.suffix || ''}
              >
                {s.value}{s.suffix || ''}
              </div>
              <div className="text-[#555] text-[10px] tracking-[2px] uppercase mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
