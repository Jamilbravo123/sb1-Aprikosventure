import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-24 lg:pt-28">{children}</main>
      <Footer />
    </div>
  );
}