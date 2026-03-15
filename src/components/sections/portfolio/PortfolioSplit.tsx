import { portfolioCategories, getVenturesForCategory } from '../../../data/portfolio-categories';
import CategoryColumn from './CategoryColumn';
import CopperDivider from './CopperDivider';
import CodeEntropyStrip from './CodeEntropyStrip';
import type { Venture } from '../../../types/dashboard';

export default function PortfolioSplit() {
  const [digitalAssets, healthTech] = portfolioCategories;
  const digitalVentures = getVenturesForCategory('digital-assets') as Venture[];
  const healthVentures = getVenturesForCategory('health-tech') as Venture[];

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr]">
        <CategoryColumn config={digitalAssets} ventures={digitalVentures} />
        <CopperDivider />
        <div className="lg:hidden h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent my-4" />
        <CategoryColumn config={healthTech} ventures={healthVentures} mirrored />
      </div>
      <CodeEntropyStrip />
    </div>
  );
}
