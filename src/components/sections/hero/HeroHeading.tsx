import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../lib/gsap';
import { splitWords } from '../../../utils/splitWords';

const ROTATION_WORDS = ['BUILD', 'INVEST', 'SCALE'];

export default function HeroHeading() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const words = containerRef.current.querySelectorAll('.hero-word');
    gsap.from(words, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.06,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  useEffect(() => {
    if (!wordRef.current) return;
    const el = wordRef.current;
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % ROTATION_WORDS.length;
      const nextWord = ROTATION_WORDS[currentIndex];

      gsap.to(el, {
        y: -10,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          el.textContent = nextWord;
          gsap.fromTo(el,
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
          );
        },
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const line1Words = splitWords('Turning Ideas Into');

  return (
    <div ref={containerRef} className="text-center">
      <div className="font-display text-[clamp(2.5rem,6vw,3.5rem)] font-bold leading-[1.12] tracking-tight text-white">
        {line1Words.map((word, i) => (
          <span key={i} className="hero-word inline-block mr-[0.3em]">{word}</span>
        ))}
        <br />
        <span className="hero-word inline-block mr-[0.3em] text-gold italic">Impactful</span>
        <span className="hero-word inline-block">Ventures</span>
      </div>

      <div className="flex items-center justify-center gap-3 mt-8">
        <span className="text-[#444] text-xs tracking-[3px] uppercase">WE</span>
        <div className="bg-gold/[0.06] border border-gold/[0.12] rounded-lg px-5 py-2">
          <span
            ref={wordRef}
            className="text-gold-light text-sm font-semibold tracking-wider"
          >
            {ROTATION_WORDS[0]}
          </span>
        </div>
      </div>
    </div>
  );
}
