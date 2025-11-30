import PortfolioHeader from './PortfolioHeader';
import PortfolioCard from './PortfolioCard';
import { portfolioData } from './data';

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <PortfolioHeader />
        
        {/* Unified Portfolio Grid */}
        <div className="mt-16">
          <p className="text-center text-lg text-slate-600 mb-12 max-w-3xl mx-auto">
            Diversified ventures across AI, healthcare, Web3, and maritime innovation
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {portfolioData.map((item, index) => (
              <div
                key={item.title}
                className="opacity-0 animate-fade-in flex"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PortfolioCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}