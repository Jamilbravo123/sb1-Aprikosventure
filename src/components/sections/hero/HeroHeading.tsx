import { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../lib/gsap';
import { splitWords } from '../../../utils/splitWords';

const ROTATION_WORDS = ['BUILD', 'INVEST', 'SCALE'];
const TYPE_SPEED = 80;   // ms per character
const DELETE_SPEED = 50;  // ms per character delete
const HOLD_DELAY = 1400;  // ms to hold completed word

export default function HeroHeading() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

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

  // Blinking cursor
  useEffect(() => {
    const blink = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(blink);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const currentWord = ROTATION_WORDS[wordIndex];

    if (!isDeleting && displayText === currentWord) {
      // Word complete — hold, then start deleting
      const holdTimer = setTimeout(() => setIsDeleting(true), HOLD_DELAY);
      return () => clearTimeout(holdTimer);
    }

    if (isDeleting && displayText === '') {
      // Deletion complete — move to next word
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % ROTATION_WORDS.length);
      return;
    }

    const speed = isDeleting ? DELETE_SPEED : TYPE_SPEED;
    const timer = setTimeout(() => {
      if (isDeleting) {
        setDisplayText(currentWord.slice(0, displayText.length - 1));
      } else {
        setDisplayText(currentWord.slice(0, displayText.length + 1));
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, wordIndex]);

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
        <div className="bg-gold/[0.06] border border-gold/[0.12] rounded-lg px-5 py-2 min-w-[120px]">
          <span className="text-gold-light text-sm font-semibold tracking-wider">
            {displayText}
          </span>
          <span
            className="text-gold-light text-sm font-light ml-[1px] transition-opacity duration-100"
            style={{ opacity: cursorVisible ? 1 : 0 }}
          >
            |
          </span>
        </div>
      </div>
    </div>
  );
}
