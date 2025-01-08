import React, { useState, useEffect } from 'react';
import NavLink from './NavLink';
import LogoLink from '../brand/LogoLink';
import { MobileMenu, MobileMenuButton } from './mobile';
import InvestorButton from '../common/InvestorButton';
import OwnerRegistrationButton from '../common/OwnerRegistrationButton';

const navLinks = [
  { href: '#process', label: 'Process' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#about', label: 'About' },
  { href: '#team', label: 'Team' },
  { href: '#contact', label: 'Contact' }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed inset-x-2 sm:inset-x-4 top-2 sm:top-4 z-50 transition-all duration-300 rounded-2xl lg:inset-x-8 ${
        isScrolled || isMobileMenuOpen ? 'bg-white shadow-lg' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <LogoLink className="py-2" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center">
            <div className="hidden lg:flex lg:items-center lg:gap-12 pl-16">
              <InvestorButton />
              <OwnerRegistrationButton />
            </div>
            
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <MobileMenuButton 
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={isMobileMenuOpen}
          links={navLinks}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </nav>
    </header>
  );
}