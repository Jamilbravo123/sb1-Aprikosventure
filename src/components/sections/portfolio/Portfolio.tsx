import PortfolioHeader from './PortfolioHeader';
import PortfolioSplit from './PortfolioSplit';

export default function Portfolio() {
  return (
    <section id="ventures" className="py-24 bg-[#0c0c0c]">
      <div className="max-w-[1100px] mx-auto px-6">
        <PortfolioHeader />
        <PortfolioSplit />
      </div>
    </section>
  );
}
