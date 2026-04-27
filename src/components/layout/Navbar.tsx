import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavLink from './NavLink';
import LogoLink from '../brand/LogoLink';
import { MobileMenu, MobileMenuButton } from './mobile';

const navLinks = [
  { href: '#ventures', label: 'Ventures' },
  { href: '#about', label: 'About' },
  { href: '#team', label: 'Team' },
  { href: '#news', label: 'News' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const navigate = useNavigate();
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
      className={`fixed inset-x-0 z-50 transition-all duration-500 ${
        isScrolled || isMobileMenuOpen
          ? 'top-0 bg-[#0c0c0c]/90 backdrop-blur-xl shadow-lg shadow-black/10'
          : 'top-9 bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <LogoLink className="py-2 brightness-0 invert" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-10">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Investor CTA */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <button
              onClick={() => navigate('/register')}
              className="text-xs font-medium tracking-widest uppercase transition-all duration-300 hover:text-gold"
              style={{
                background: 'none',
                color: '#C9935E',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.15em',
              }}
            >
              Investor Pre-Registration →
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <MobileMenuButton
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>
      </nav>

      {/* Mobile Menu — outside nav to avoid overflow issues */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        links={navLinks}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}
