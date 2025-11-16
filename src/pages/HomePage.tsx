import React from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/sections/hero';
import Process from '../components/sections/process/Process';
import Portfolio from '../components/sections/portfolio/Portfolio';
import About from '../components/sections/about/About';
import Team from '../components/sections/team/Team';
import ContactSection from '../components/sections/contact/ContactSection';

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      <Process />
      <Portfolio />
      <About />
      <Team />
      <ContactSection />
    </Layout>
  );
}

