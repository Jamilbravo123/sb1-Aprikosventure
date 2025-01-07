import React from 'react';
import Layout from './components/layout/Layout';
import Hero from './components/sections/Hero';
import Process from './components/sections/process/Process';
import Portfolio from './components/sections/portfolio/Portfolio';
import About from './components/sections/about/About';
import Team from './components/sections/team/Team';
import Contact from './components/sections/Contact';

export default function App() {
  return (
    <Layout>
      <Hero />
      <Process />
      <Portfolio />
      <About />
      <Team />
      <Contact />
    </Layout>
  );
}