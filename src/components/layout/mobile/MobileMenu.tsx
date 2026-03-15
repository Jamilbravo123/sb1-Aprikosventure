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

  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-[100] bg-[#0c0c0c] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
        <h2 className="text-lg font-semibold text-white">Menu</h2>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-lg p-2 text-slate-400 hover:text-gold transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
        {links.map(({ href, label }) => (
          <button
            key={href}
            className="text-left py-4 text-2xl font-display font-bold text-white hover:text-gold transition-colors border-b border-white/[0.04] last:border-b-0"
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

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-[#444] text-xs tracking-wider uppercase">
          Venture Studio · Oslo | Berlin | Lahore | Dubai
        </p>
      </div>
    </div>
  );
}
