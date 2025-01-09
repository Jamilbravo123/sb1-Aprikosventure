import React, { useState, useEffect } from 'react';

interface NewsItem {
  text: string;
  url?: string;
}

const news: NewsItem[] = [
  {
    text: "New venture opportunity in AI technology coming soon! Pre-register now!",
    url: "#portfolio"
  },
  {
    text: "Venture Token in initial talk of co-operation with Aprikos Venture",
    url: "#contact"
  },
  {
    text: "Aprikos Venture expands portfolio in South Asia region - launching Mashwara AI",
    url: "https://mashwara.ai/"
  },
  {
    text: "Latest investment round opening in February 2025 - Pre-register now for tokenized shares!",
    url: "#investors"
  },
  {
    text: "New partnerships forged in tech innovation for on-chain maritime investments.",
    url: "#contact"
  }
];

export default function NewsTicker() {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 0) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const currentNews = news[currentNewsIndex];

  const NewsContent = () => (
    <span className={`
      inline-block 
      text-white/95 
      font-mono 
      ${isMobile ? 'text-[10px] leading-tight' : 'text-sm'} 
      ${isMobile ? 'px-2' : 'px-4'}
    `}>
      {currentNews.url ? (
        <a 
          href={currentNews.url}
          className="
            group
            relative
            hover:text-white
            transition-all
            duration-300
            cursor-pointer
            border-b
            border-white/30
            hover:border-white
            hover:shadow-glow
          "
          onClick={(e) => {
            e.preventDefault();
            if (currentNews.url?.startsWith('#')) {
              document.querySelector(currentNews.url)?.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.open(currentNews.url, '_blank', 'noopener,noreferrer');
            }
          }}
        >
          {currentNews.text}
          <span className={`
            inline-block 
            ml-2 
            transform 
            group-hover:translate-x-1 
            transition-transform 
            duration-300
            ${isMobile ? 'hidden' : ''}
          `}>
            →
          </span>
        </a>
      ) : (
        currentNews.text
      )}
      &nbsp;&nbsp;&nbsp;
    </span>
  );

  return (
    <div className={`
      w-full 
      overflow-hidden 
      bg-gradient-to-r 
      from-[#0A3B63] 
      to-[#0F4C81] 
      backdrop-blur-sm 
      ${isMobile ? 'py-0.5' : 'py-1'}
      transition-all 
      duration-300
    `}>
      <div className="relative w-full">
        <style jsx>{`
          .shadow-glow {
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
          }
        `}</style>
        <div 
          className="whitespace-nowrap animate-ticker inline-block"
          style={{
            animation: `ticker ${isMobile ? '30s' : '25s'} linear infinite`,
            width: 'max-content',
            paddingRight: '100%'
          }}
        >
          <NewsContent />
        </div>
      </div>
    </div>
  );
}
