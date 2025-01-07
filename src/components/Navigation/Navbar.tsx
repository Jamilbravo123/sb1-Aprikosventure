import React from 'react';
import NavLink from './NavLink';

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-sm">
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5 text-2xl font-bold text-gray-900">
            Aprikos Venture
          </a>
        </div>
        <div className="flex gap-x-8">
          <NavLink href="#about">About</NavLink>
          <NavLink href="#portfolio">Portfolio</NavLink>
          <NavLink href="#contact">Contact</NavLink>
          <NavLink href="#investor">Investor Portal</NavLink>
        </div>
      </nav>
    </header>
  );
}