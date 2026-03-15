import { useState, useEffect } from 'react';
import NavLink from './NavLink';
import LogoLink from '../brand/LogoLink';
import { MobileMenu, MobileMenuButton } from './mobile';
import UserMenu from '../common/UserMenu';
import { useAuth } from '../../contexts/AuthContext';

const navLinks = [
  { href: '#ventures', label: 'Ventures' },
  { href: '#about', label: 'About' },
  { href: '#team', label: 'Team' },
  { href: '#news', label: 'News' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-[#0c0c0c]/90 backdrop-blur-xl shadow-lg shadow-black/10'
          : 'bg-transparent'
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

          {/* Action Buttons */}
          <div className="flex items-center">
            <div className="hidden lg:flex lg:items-center lg:gap-4 pl-10">
              {user ? (
                <UserMenu />
              ) : (
                <a
                  href="/investor-login"
                  className="text-sm font-medium text-[#0c0c0c] bg-[#C9935E] hover:bg-[#E8C896] transition-colors px-5 py-2.5 rounded-lg"
                >
                  Investor Login
                </a>
              )}
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
