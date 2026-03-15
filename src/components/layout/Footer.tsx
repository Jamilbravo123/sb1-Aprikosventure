import { Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0c0c0c]">
      {/* Copper gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C9935E]/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="md:order-1">
          <p className="text-center text-sm leading-5 text-slate-500">
            &copy; {new Date().getFullYear()} Aprikos Venture AS
          </p>
        </div>
        <div className="flex justify-center items-center space-x-6 mt-6 md:order-2 md:mt-0">
          <a
            href="/privacy"
            className="text-sm text-slate-500 hover:text-[#C9935E] transition-colors"
          >
            Privacy
          </a>
          <a
            href="https://www.linkedin.com/company/aprikos-venture/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-[#C9935E] transition-colors"
          >
            <span className="sr-only">LinkedIn</span>
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="https://www.instagram.com/aprikosventure/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-[#C9935E] transition-colors"
          >
            <span className="sr-only">Instagram</span>
            <Instagram className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
