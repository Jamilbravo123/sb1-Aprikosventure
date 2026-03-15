import { useNavigate, useLocation } from 'react-router-dom';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const doScroll = () => {
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(doScroll, 100);
    } else {
      doScroll();
    }
  };

  return (
    <a
      href={href}
      onClick={scrollToSection}
      className="text-sm font-medium leading-6 text-slate-300 hover:text-gold transition-colors px-3 py-2"
    >
      {children}
    </a>
  );
}
