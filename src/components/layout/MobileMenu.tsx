import React from 'react';
import { useSpring, animated } from '@react-spring/web';

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  links: NavLink[];
  onClose: () => void;
}

export default function MobileMenu({ isOpen, links, onClose }: MobileMenuProps) {
  const menuAnimation = useSpring({
    transform: isOpen ? 'translateX(0%)' : 'translateX(100%)',
    opacity: isOpen ? 1 : 0,
    config: { tension: 300, friction: 20 }
  });

  const handleLinkClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-40">
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <animated.div 
        style={menuAnimation}
        className="absolute right-0 h-full w-full max-w-sm bg-white shadow-xl"
      >
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="p-6">
            <nav className="space-y-6">
              {links.map(({ href, label }) => (
                <div 
                  key={href} 
                  className="border-b border-slate-100 pb-6 last:border-0"
                  onClick={() => handleLinkClick(href)}
                >
                  <button className="text-base font-semibold text-slate-900 hover:text-purple-600 transition-colors w-full text-left">
                    {label}
                  </button>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </animated.div>
    </div>
  );
}