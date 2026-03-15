import { useEffect } from 'react';
import { X } from 'lucide-react';

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

  return (
    <>
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`lg:hidden fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-[#0A0E1A] border-l border-slate-800/50 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b border-slate-800/50">
            <h2 className="text-lg font-semibold text-white">Menu</h2>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="rounded-lg p-2 text-slate-400 hover:text-gold hover:bg-slate-800/50 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {links.map(({ href, label }) => (
                <button
                  key={href}
                  className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-slate-300 hover:text-gold hover:bg-slate-800/50 transition-all duration-200"
                  onClick={() => {
                    onClose();
                    const element = document.querySelector(href);
                    if (element) {
                      setTimeout(() => {
                        const offset = 80;
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - offset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                      }, 150);
                    }
                  }}
                >
                  {label}
                </button>
              ))}
            </nav>

          </div>
        </div>
      </div>
    </>
  );
}
