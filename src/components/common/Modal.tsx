import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { gradients } from '../../constants/colors';
import { useSpring, animated } from '@react-spring/web';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const animation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'scale(1)' : 'scale(0.95)',
    config: { tension: 300, friction: 20 }
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" 
          onClick={onClose}
          aria-hidden="true"
        />
        
        <animated.div
          ref={modalRef}
          style={animation}
          className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xl font-semibold ${gradients.brand.primary} bg-clip-text text-transparent`}>
              {title}
            </h3>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {children}
        </animated.div>
      </div>
    </div>
  );
}