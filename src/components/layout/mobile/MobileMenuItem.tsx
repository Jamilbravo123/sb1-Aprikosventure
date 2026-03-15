interface MobileMenuItemProps {
  href: string;
  label: string;
  onClick: () => void;
}

export default function MobileMenuItem({ href, label, onClick }: MobileMenuItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      onClick();
      setTimeout(() => {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-slate-300 hover:text-gold hover:bg-slate-800/50 transition-all duration-200"
    >
      {label}
    </button>
  );
}
