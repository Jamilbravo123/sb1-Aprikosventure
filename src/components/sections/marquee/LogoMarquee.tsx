import { ventures } from '../../../data/ventures.mock';

interface MarqueeItem {
  name: string;
  logo?: string;
}

// Get top-level ventures (include those without logos too)
const items: MarqueeItem[] = ventures
  .filter(v => !v.parentId)
  .map(v => ({ name: v.name, logo: v.logo || undefined }));

// Double the array for seamless loop
const marqueeItems = [...items, ...items];

export default function LogoMarquee() {
  return (
    <section className="py-16 bg-[#0c0c0c] overflow-hidden">
      <p className="text-center text-sm uppercase tracking-[0.25em] text-[#C9935E] mb-10">
        Ventures across our ecosystem
      </p>
      <div className="relative">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0c0c0c] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0c0c0c] to-transparent z-10" />

        {/* Marquee track */}
        <div className="flex animate-marquee">
          {marqueeItems.map((item, i) => (
            <div
              key={`${item.name}-${i}`}
              className="flex-shrink-0 mx-8 sm:mx-12 group flex items-center"
            >
              {item.logo ? (
                <img
                  src={item.logo}
                  alt={item.name}
                  loading="lazy"
                  className="h-8 sm:h-10 w-auto object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-500"
                />
              ) : (
                <span className="text-sm sm:text-base font-medium text-white/30 group-hover:text-[#C9935E]/70 whitespace-nowrap transition-all duration-500">
                  {item.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
