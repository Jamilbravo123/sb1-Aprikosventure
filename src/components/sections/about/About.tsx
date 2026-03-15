import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../lib/gsap';
import { Target, Lightbulb, Users, Rocket } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Strategic Vision',
    description: 'Identifying and nurturing transformative ideas that shape the future of technology and business.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation First',
    description: 'Focused on emerging technologies to drive breakthrough solutions across industries.',
  },
  {
    icon: Users,
    title: 'Strong Partnerships',
    description: 'Building lasting relationships with founders, creating value through collaborative growth.',
  },
  {
    icon: Rocket,
    title: 'Rapid Execution',
    description: 'Proven methodology for quick validation and efficient scaling of ventures.',
  },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll('.value-card');
    gsap.from(cards, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
      },
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }, { scope: sectionRef });

  return (
    <section id="about" className="py-24 bg-[#111827]">
      <div ref={sectionRef} className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-white">
              About Us
            </h2>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold to-transparent rounded-full mt-3" />
          </div>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            We are a Norwegian venture studio transforming innovative ideas into successful companies. Through strategic investment and hands-on operational support, we help founders build market-leading businesses across borders.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <div
              key={value.title}
              className="value-card group rounded-2xl bg-[#1E293B]/50 backdrop-blur-sm border border-slate-700/30 p-6 transition-all duration-500 hover:border-gold/30"
            >
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                <value.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
