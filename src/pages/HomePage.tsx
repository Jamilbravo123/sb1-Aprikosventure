import Layout from '../components/layout/Layout';
import Hero from '../components/sections/hero';
import Portfolio from '../components/sections/portfolio/Portfolio';
import VentureModel from '../components/sections/venture-model/VentureModel';
import Thesis from '../components/sections/thesis/Thesis';
import Team from '../components/sections/team/Team';
import News from '../components/sections/news';
import ContactSection from '../components/sections/contact/ContactSection';

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      <Portfolio />
      <VentureModel />
      <Thesis />
      <Team />
      <News />
      <ContactSection />
    </Layout>
  );
}
