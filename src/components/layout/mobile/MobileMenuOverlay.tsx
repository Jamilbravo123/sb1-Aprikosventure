interface MobileMenuOverlayProps {
  onClick: () => void;
}

export default function MobileMenuOverlay({ onClick }: MobileMenuOverlayProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
      onClick={onClick}
      aria-hidden="true"
      style={{ touchAction: 'none' }}
    />
  );
}
