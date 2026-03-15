import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../../lib/gsap';
import { modelSteps } from './venture-model.data';
import TimelineStep from './TimelineStep';
import jamilSpeech from '../../../assets/images/hero/jamil-speach.webp';
import saraTable from '../../../assets/images/hero/sara-table.webp';
import janniElise from '../../../assets/images/hero/janni-elise.webp';

const floatingImages = [
  {
    src: janniElise,
    alt: 'Aprikos Venture event',
    className: 'left-[2%] top-[5%] w-[160px] h-[220px] -rotate-3',
  },
  {
    src: jamilSpeech,
    alt: 'Jamil Rehman speaking',
    className: 'right-[2%] top-[0%] w-[150px] h-[210px] rotate-2',
  },
  {
    src: saraTable,
    alt: 'Aprikos Venture dinner',
    className: 'left-[8%] bottom-[5%] w-[170px] h-[210px] rotate-1',
  },
];

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
    const images = sectionRef.current.querySelectorAll('.float-img');

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

    // Floating images fade in + gentle float
    gsap.fromTo(images,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        stagger: 0.3,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      },
    );

    images.forEach((img, i) => {
      gsap.to(img, {
        y: '+=10',
        duration: 3.5 + i * 0.7,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.6,
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 bg-[#0c0c0c] relative overflow-hidden">
      {/* Floating images — desktop only */}
      <div className="hidden xl:block">
        {floatingImages.map((img, i) => (
          <div
            key={i}
            className={`float-img absolute ${img.className} rounded-2xl overflow-hidden opacity-0`}
            style={{ willChange: 'transform' }}
          >
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#0c0c0c]/60" />
            <div className="absolute inset-0 rounded-2xl border border-gold/10" />
          </div>
        ))}
      </div>

      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-gold text-[11px] tracking-[4px] uppercase mb-3.5">How We Work</p>
          <h2 className="font-display text-4xl font-bold mb-3.5 text-white">From Idea to Impact</h2>
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
