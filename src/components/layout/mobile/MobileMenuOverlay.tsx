import React from 'react';

interface MobileMenuOverlayProps {
  onClick: () => void;
}

export default function MobileMenuOverlay({ onClick }: MobileMenuOverlayProps) {
  return (
    <div 
      className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity duration-300"
      onClick={onClick}
      aria-hidden="true"
      style={{ touchAction: 'none' }}
    />
  );
}