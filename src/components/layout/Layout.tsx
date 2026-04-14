import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import TopStrip from './TopStrip';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0E1A] font-body">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold focus:text-dark-primary focus:rounded-lg">
        Skip to content
      </a>
      <TopStrip />
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
