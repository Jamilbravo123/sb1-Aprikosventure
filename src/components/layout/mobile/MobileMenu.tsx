import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';
import InvestorButton from '../../common/InvestorButton';
import OwnerRegistrationButton from '../../common/OwnerRegistrationButton';

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
    config: { tension: 400, friction: 30 }
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-[90]">
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <animated.div 
        style={menuAnimation}
        className="absolute right-0 h-full w-full max-w-sm bg-white shadow-xl"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">Menu</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {links.map(({ href, label }) => (
                <button
                  key={href}
                  className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-slate-900 hover:bg-slate-50 transition-colors"
                  onClick={() => {
                    onClose();
                    const element = document.querySelector(href);
                    if (element) {
                      setTimeout(() => {
                        const offset = 80;
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - offset;
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                      }, 150);
                    }
                  }}
                >
                  {label}
                </button>
              ))}
            </nav>

            <div className="mt-6 space-y-3 pt-6 border-t border-slate-100">
              <InvestorButton />
              <OwnerRegistrationButton />
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  );
}